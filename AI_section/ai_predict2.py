from pathlib import Path
import numpy as np
import pandas as pd
from catboost import CatBoostRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

PROJECT_ROOT=Path(__file__).resolve().parents[1]
DATA_PATH=PROJECT_ROOT/"data"/"culture_hackathon_data_only.xlsx"
FEATURES=["event_type","day_of_week","start_hour","duration_min","capacity","price_rub","age_range","institution_type","center"]
CAT_FEATURES=["event_type","day_of_week","institution_type","center"]

def load_data(data_path=DATA_PATH):
    e=pd.read_excel(data_path,"events_synthetic"); i=pd.read_excel(data_path,"institutions_official")
    a=pd.read_excel(data_path,"attendance_synthetic"); v=pd.read_excel(data_path,"venues_synthetic")
    return e,i,a,v

def prepare_training_data(events,institutions,attendance):
    d=events.merge(institutions,on="institution_id",how="left").merge(attendance[["event_id","fill_rate_pct"]],on="event_id",how="left")
    d["start_hour"]=pd.to_datetime(d.start_time,format="%H:%M").dt.hour
    d["age_range"]=d.target_age_max-d.target_age_min
    d["day_of_week"]=d.day_of_week.fillna(pd.to_datetime(d.date).dt.day_name())
    return d.dropna(subset=["fill_rate_pct"]+FEATURES).copy()

def train_event_success_model(events,institutions,attendance):
    d=prepare_training_data(events,institutions,attendance); X,y=d[FEATURES],d.fill_rate_pct
    Xtr,Xte,ytr,yte=train_test_split(X,y,test_size=.2,random_state=42)
    model=CatBoostRegressor(iterations=500,learning_rate=.05,depth=6,loss_function="MAE",random_seed=42,verbose=False)
    model.fit(Xtr,ytr,cat_features=CAT_FEATURES)
    mae=mean_absolute_error(yte,model.predict(Xte))
    return model,mae

def predict_events(model,new_events,institutions):
    d=new_events.merge(institutions,on="institution_id",how="left").copy()
    d["start_hour"]=pd.to_datetime(d.start_time,format="%H:%M").dt.hour
    d["age_range"]=d.target_age_max-d.target_age_min
    d["day_of_week"]=d.day_of_week.fillna(pd.to_datetime(d.date).dt.day_name())
    d["predicted_fill_pct"]=model.predict(d[FEATURES]).clip(0,100)
    d["expected_visitors"]=np.floor(d.capacity*d.predicted_fill_pct/100).astype(int)
    d["expected_revenue_rub"]=(d.expected_visitors*d.price_rub).round()
    return d[["event_id","event_name","institution_id","institution","venue_id","capacity","predicted_fill_pct","expected_visitors","expected_revenue_rub"]].sort_values("expected_visitors",ascending=False)

def recommend_organizations(model,event_type,date,start_time,duration_min,price_rub,target_age_min,target_age_max,institutions,venues,top_n=5):
    candidates=[]
    for v in venues.itertuples(index=False):
        allowed={x.strip() for x in str(v.suitable_event_types).split(",")}
        if event_type not in allowed: continue
        ins=institutions[institutions.institution_id.eq(v.institution_id)]
        if ins.empty: continue
        ins=ins.iloc[0]
        candidates.append({"event_id":"RECOMMENDATION","event_name":"Предлагаемое мероприятие","event_type":event_type,
            "date":pd.to_datetime(date),"day_of_week":pd.to_datetime(date).day_name(),"start_time":start_time,
            "duration_min":duration_min,"capacity":int(v.capacity),"price_rub":price_rub,
            "target_age_min":target_age_min,"target_age_max":target_age_max,
            "institution_id":v.institution_id,"venue_id":v.venue_id})
    if not candidates: return pd.DataFrame()
    r=predict_events(model,pd.DataFrame(candidates),institutions)
    r=r.sort_values(["expected_visitors","predicted_fill_pct"],ascending=False).drop_duplicates("institution_id").head(top_n).reset_index(drop=True)
    r.insert(0,"recommendation_rank",np.arange(1,len(r)+1))
    return r[["recommendation_rank","institution","institution_id","venue_id","capacity","predicted_fill_pct","expected_visitors","expected_revenue_rub"]]

if __name__=="__main__":
    e,i,a,v=load_data(); model,mae=train_event_success_model(e,i,a); print(f"MAE: {mae:.2f} п.п.")
    print(recommend_organizations(model,"Лекция","2026-10-10","18:00",90,300,14,30,i,v).to_string(index=False))
