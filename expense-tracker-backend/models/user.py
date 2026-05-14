import psycopg2
import psycopg2.extras
from database.db import get_db

def create_users_table():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(120) UNIQUE NOT NULL,
            password VARCHAR(200) NOT NULL,
            role VARCHAR(20) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT NOW(),
            last_login TIMESTAMP
        )
    """)
    # Add column to existing table to avoid manual migrations
    cur.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;")
    conn.commit()
    cur.close()
    conn.close()

def create_user(name, email, password, role='user'):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)", (name, email, password, role))
    conn.commit()
    cur.close()
    conn.close()

def get_user_by_email(email):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close()
    conn.close()
    return user

def get_user_by_id(user_id):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cur.fetchone()
    cur.close()
    conn.close()
    return user

def get_all_users():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC")
    users = cur.fetchall()
    cur.close()
    conn.close()
    return users

def update_user_role(user_id, role):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("UPDATE users SET role = %s WHERE id = %s", (role, user_id))
    conn.commit()
    cur.close()
    conn.close()

def update_last_login(user_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("UPDATE users SET last_login = NOW() WHERE id = %s", (user_id,))
    conn.commit()
    cur.close()
    conn.close()