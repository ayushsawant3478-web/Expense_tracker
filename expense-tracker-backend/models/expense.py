import psycopg2
import psycopg2.extras
from database.db import get_db

def create_expenses_table():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS expenses (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            title VARCHAR(100) NOT NULL,
            amount FLOAT NOT NULL,
            category VARCHAR(50) NOT NULL,
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            note VARCHAR(200)
        )
    """)
    conn.commit()
    cur.close()
    conn.close()

def add_expense(user_id, title, amount, category, note):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("INSERT INTO expenses (user_id, title, amount, category, note) VALUES (%s, %s, %s, %s, %s)",
                (user_id, title, amount, category, note))
    conn.commit()
    cur.close()
    conn.close()

def get_expenses(user_id):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT * FROM expenses WHERE user_id = %s ORDER BY date DESC", (user_id,))
    expenses = cur.fetchall()
    cur.close()
    conn.close()
    return expenses

def delete_expense(expense_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM expenses WHERE id = %s", (expense_id,))
    conn.commit()
    cur.close()
    conn.close()