import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv
load_dotenv()

def get_db():
    conn = psycopg2.connect(
        os.getenv("DATABASE_URL"),
        connect_timeout=30,
        keepalives=1,
        keepalives_idle=30,
        keepalives_interval=10,
        keepalives_count=5
    )
    return conn