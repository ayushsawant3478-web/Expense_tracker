from app import app
from models.security import get_failed_login_count, is_account_locked, lock_user_account, clear_failed_logins, record_failed_login
from models.user import create_user, get_user_by_email
from database.db import get_db

with app.app_context():
    email = "testlockout@example.com"
    user = get_user_by_email(email)
    if not user:
        create_user("Test Lockout", email, "password123")
    
    clear_failed_logins(email)
    conn = get_db()
    cur = conn.cursor()
    cur.execute("UPDATE users SET locked_until = NULL WHERE email = %s", (email,))
    conn.commit()
    
    for i in range(5):
        record_failed_login(email, "127.0.0.1")
        
    count = get_failed_login_count(email, 10)
    print(f"Failed count: {count}")
    
    lock_user_account(email, 30)
    locked, locked_until = is_account_locked(email)
    print(f"Is locked: {locked}, Until: {locked_until}")

