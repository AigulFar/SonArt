import pandas as pd
from pathlib import Path
import sqlite3

BASE_DIR = Path(__file__).parent.resolve()
DB_NAME = 'sanart.db'
EXCEL_FILE = BASE_DIR / 'culture_hackathon_data_only.xlsx' # Подставьте имя вашего файла

def get_events_dataframe():
    with sqlite3.connect(DB_NAME) as conn:
        return pd.read_sql("SELECT * FROM events", conn)

def get_user_by_id(user_id: int):
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        # ВАЖНО: параметры передавать только через знак вопроса (защита от инъекций и багов)
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        return cursor.fetchone() # Вернет tuple или None

def add_event(event_name: str, metric_value: float):
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO events (name, value) VALUES (?, ?)", 
            (event_name, metric_value)
        )
        conn.commit() # Без этого изменения не сохранятся

def init_database():
    # Названия таблиц строго по спецификации
    tables = [
        'institutions_official',
        'events_synthetic',
        'attendance_synthetic',
        'audience_synthetic',
        'feedback_synthetic'
    ]

    with sqlite3.connect(DB_NAME) as conn:
        for table_name in tables:
            try:
                # Читаем лист экселя, совпадающий с именем таблицы
                df = pd.read_excel(EXCEL_FILE, sheet_name=table_name)
                
                # Заливаем в SQLite
                df.to_sql(table_name, conn, if_exists='replace', index=False)
                print(f"[OK] Таблица {table_name} загружена ({len(df)} строк).")
            except Exception as e:
                print(f"[FAIL] Ошибка с таблицей {table_name}: {e}")

if __name__ == "__main__":
    init_database()