from pathlib import Path
import pandas as pd

from ai_predict2 import load_data, train_event_success_model, recommend_organizations
from ai_predict import load_audience, cluster_audience, cluster_summary

def build_ml_context(
    event_type: str,
    date: str,
    start_time: str,
    duration_min: int,
    price_rub: float,
    target_age_min: int,
    target_age_max: int,
    top_n: int = 5,
):
    """
    Главная функция для сайта/API:
    1) обучает/загружает ML;
    2) подбирает организации и площадки;
    3) возвращает JSON-подобный словарь для передачи LLM.
    """
    events, institutions, attendance, venues = load_data()
    model, mae = train_event_success_model(events, institutions, attendance)

    recommendations = recommend_organizations(
        model=model,
        event_type=event_type,
        date=date,
        start_time=start_time,
        duration_min=duration_min,
        price_rub=price_rub,
        target_age_min=target_age_min,
        target_age_max=target_age_max,
        institutions=institutions,
        venues=venues,
        top_n=top_n,
    )

    return {
        "model_mae_percentage_points": round(float(mae), 2),
        "recommendations": recommendations.to_dict(orient="records"),
        "note": "Числовые прогнозы рассчитаны ML-моделью; LLM должна только объяснять и формулировать рекомендацию.",
    }


if __name__ == "__main__":
    result = build_ml_context(
        event_type="Лекция",
        date="2026-10-10",
        start_time="18:00",
        duration_min=90,
        price_rub=300,
        target_age_min=14,
        target_age_max=30,
    )
    import json
    print(json.dumps(result, ensure_ascii=False, indent=2))
