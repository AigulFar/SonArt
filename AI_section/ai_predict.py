from pathlib import Path
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.cluster import HDBSCAN
from sklearn.preprocessing import RobustScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.decomposition import PCA

PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = PROJECT_ROOT / "data" / "culture_hackathon_data_only.xlsx"
NUMERIC_COLS = ["age","visit_count_2026","feedback_count_2026","avg_rating","engagement_score"]
CATEGORICAL_COLS = ["age_group","favorite_event_type"]

def load_audience(data_path=DATA_PATH):
    return pd.read_excel(data_path,sheet_name="audience_synthetic")

def build_cluster_model(min_cluster_size=400):
    prep=ColumnTransformer([
        ("num",RobustScaler(),NUMERIC_COLS),
        ("cat",OneHotEncoder(handle_unknown="ignore",sparse_output=False),CATEGORICAL_COLS)
    ])
    return Pipeline([("preprocessor",prep),("hdbscan",HDBSCAN(min_cluster_size=min_cluster_size,min_samples=5))])

def cluster_audience(df,min_cluster_size=400):
    model=build_cluster_model(min_cluster_size)
    features=NUMERIC_COLS+CATEGORICAL_COLS
    out=df.copy(); out["cluster"]=model.fit_predict(out[features])
    return out,model

def cluster_summary(df):
    rows=[]
    for cid,g in df.groupby("cluster"):
        rows.append({"cluster":int(cid),"visitors":len(g),"share_pct":round(len(g)/len(df)*100,1),
                     "avg_age":round(g.age.mean(),1),"avg_visits":round(g.visit_count_2026.mean(),2),
                     "avg_engagement":round(g.engagement_score.mean(),1),
                     "top_event_type":g.favorite_event_type.mode().iat[0]})
    return pd.DataFrame(rows).sort_values("cluster")

def plot_clusters(df,model):
    features=NUMERIC_COLS+CATEGORICAL_COLS
    X=model.named_steps["preprocessor"].transform(df[features])
    X2=PCA(n_components=2,random_state=42).fit_transform(X)
    plt.figure(figsize=(9,6))
    for cid in sorted(df.cluster.unique()):
        mask=df.cluster.to_numpy()==cid
        plt.scatter(X2[mask,0],X2[mask,1],s=18,alpha=.6,label=f"cluster {cid}")
    plt.title("Сегментация аудитории: HDBSCAN + PCA")
    plt.xlabel("PC1"); plt.ylabel("PC2"); plt.legend(); plt.grid(alpha=.2); plt.tight_layout(); plt.show()

if __name__=="__main__":
    a=load_audience(); c,m=cluster_audience(a,400); print(cluster_summary(c).to_string(index=False)); plot_clusters(c,m)
