import psycopg2
import psycopg2.extras
from database.db import get_db
from datetime import datetime

def create_logs_table():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS logs (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            action VARCHAR(255) NOT NULL,
            timestamp TIMESTAMP DEFAULT NOW()
        )
    """)
    conn.commit()
    cur.close()
    conn.close()

def create_log(user_id, action):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO logs (user_id, action, timestamp) VALUES (%s, %s, %s)",
        (user_id, action, datetime.now())
    )
    conn.commit()
    cur.close()
    conn.close()

def get_all_logs():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        SELECT logs.*, users.name, users.email
        FROM logs
        JOIN users ON logs.user_id = users.id
        ORDER BY timestamp DESC
        LIMIT 100
    """)
    logs = cur.fetchall()
    cur.close()
    conn.close()
    return logs

def get_logs_by_user(user_id):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        "SELECT * FROM logs WHERE user_id = %s ORDER BY timestamp DESC",
        (user_id,)
    )
    logs = cur.fetchall()
    cur.close()
    conn.close()
    return logs

def get_failed_login_count(user_id, minutes=30):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT COUNT(*) FROM logs
        WHERE user_id = %s
        AND action = 'Login Failed'
        AND timestamp > NOW() - INTERVAL '%s minutes'
    """, (user_id, minutes))
    count = cur.fetchone()[0]
    cur.close()
    conn.close()
    return count