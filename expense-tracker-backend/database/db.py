import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv
load_dotenv()

def get_db():
    db_url = os.getenv("DATABASE_URL")
    print("=== DATABASE CONNECTION ===")
    print(f"Connecting to DB URL (first 50 chars): {db_url[:50]}...")
    
    conn = psycopg2.connect(
        db_url,
        connect_timeout=30,
        keepalives=1,
        keepalives_idle=30,
        keepalives_interval=10,
        keepalives_count=5
    )
    
    # Set session timezone to IST
    cur = conn.cursor()
    cur.execute("SET timezone = 'Asia/Kolkata';")
    conn.commit()

    # Print connection details
    cur.execute("SELECT current_database(), current_user, inet_server_addr(), inet_server_port();")
    db_info = cur.fetchone()
    print(f"Connected to DB: {db_info[0]}")
    print(f"DB User: {db_info[1]}")
    print(f"DB Host: {db_info[2]}")
    print(f"DB Port: {db_info[3]}")
    print("===========================")
    cur.close()
    
    return conn