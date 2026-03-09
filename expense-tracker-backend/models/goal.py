import psycopg2
import psycopg2.extras
from database.db import get_db

def create_goals_table():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS goals (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            name VARCHAR(100) NOT NULL,
            target_amount FLOAT NOT NULL,
            saved_amount FLOAT DEFAULT 0,
            deadline DATE
        )
    """)
    conn.commit()
    cur.close()
    conn.close()

def add_goal(user_id, name, target_amount, saved_amount, deadline):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO goals (user_id, name, target_amount, saved_amount, deadline) VALUES (%s, %s, %s, %s, %s)",
        (user_id, name, target_amount, saved_amount, deadline)
    )
    conn.commit()
    cur.close()
    conn.close()

def get_goals(user_id):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT * FROM goals WHERE user_id = %s ORDER BY id DESC", (user_id,))
    goals = cur.fetchall()
    cur.close()
    conn.close()
    return goals

def update_goal_savings(goal_id, amount):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("UPDATE goals SET saved_amount = %s WHERE id = %s", (amount, goal_id))
    conn.commit()
    cur.close()
    conn.close()

def delete_goal(goal_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM goals WHERE id = %s", (goal_id,))
    conn.commit()
    cur.close()
    conn.close()
