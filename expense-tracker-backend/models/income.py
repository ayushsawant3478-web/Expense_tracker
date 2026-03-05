import psycopg2
import psycopg2.extras
from database.db import get_db

def create_income_table():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS income (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            title VARCHAR(100) NOT NULL,
            amount FLOAT NOT NULL,
            source VARCHAR(100),
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    cur.close()
    conn.close()

def add_income(user_id, title, amount, source):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("INSERT INTO income (user_id, title, amount, source) VALUES (%s, %s, %s, %s)",
                (user_id, title, amount, source))
    conn.commit()
    cur.close()
    conn.close()

def get_income(user_id):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT * FROM income WHERE user_id = %s ORDER BY date DESC", (user_id,))
    incomes = cur.fetchall()
    cur.close()
    conn.close()
    return incomes

def delete_income(income_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM income WHERE id = %s", (income_id,))
    conn.commit()
    cur.close()
    conn.close()