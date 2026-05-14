import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.db import get_db

def main():
    conn = get_db()
    cur = conn.cursor()
    
    try:
        cur.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user'")
        print("Added 'role' column to users table")
    except Exception as e:
        print(f"Role column might already exist: {e}")
    
    try:
        cur.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW()")
        print("Added 'created_at' column to users table")
    except Exception as e:
        print(f"Created_at column might already exist: {e}")
    
    conn.commit()
    cur.close()
    conn.close()
    print("Migration complete!")

if __name__ == '__main__':
    main()