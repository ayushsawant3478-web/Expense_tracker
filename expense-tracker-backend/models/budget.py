import psycopg2
import psycopg2.extras
from database.db import get_db

def create_budgets_table():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS budgets (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            category VARCHAR(50) NOT NULL,
            limit_amount FLOAT NOT NULL,
            month VARCHAR(20) NOT NULL
        )
    """)
    conn.commit()
    cur.close()
    conn.close()

def set_budget(user_id, category, limit_amount, month):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id FROM budgets WHERE user_id = %s AND month = %s", (user_id, month))
    existing = cur.fetchone()
    if existing:
        cur.execute("UPDATE budgets SET limit_amount = %s WHERE user_id = %s AND month = %s",
                    (limit_amount, user_id, month))
    else:
        cur.execute("INSERT INTO budgets (user_id, category, limit_amount, month) VALUES (%s, %s, %s, %s)",
                    (user_id, category, limit_amount, month))
    conn.commit()
    cur.close()
    conn.close()

def get_budgets(user_id):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT * FROM budgets WHERE user_id = %s", (user_id,))
    budgets = cur.fetchall()
    cur.close()
    conn.close()
    return budgets