import psycopg2
import psycopg2.extras
from database.db import get_db
from datetime import datetime

# ──────────────────────────────────────────────────────────────────────────────
# Schema
# ──────────────────────────────────────────────────────────────────────────────

def create_security_tables():
    conn = get_db()
    cur = conn.cursor()

    # Track every failed login attempt by email (no user FK — account may not exist)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS failed_logins (
            id SERIAL PRIMARY KEY,
            email VARCHAR(120) NOT NULL,
            ip_address VARCHAR(45),
            attempted_at TIMESTAMP DEFAULT NOW()
        )
    """)

    # Suspicious / security events log
    cur.execute("""
        CREATE TABLE IF NOT EXISTS suspicious_events (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            email VARCHAR(120),
            event_type VARCHAR(80) NOT NULL,
            detail TEXT,
            severity VARCHAR(20) DEFAULT 'medium',
            created_at TIMESTAMP DEFAULT NOW()
        )
    """)

    # Add locked_until column to users if it doesn't exist
    cur.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP;")

    conn.commit()
    cur.close()
    conn.close()

# ──────────────────────────────────────────────────────────────────────────────
# Failed Login tracking
# ──────────────────────────────────────────────────────────────────────────────

def record_failed_login(email, ip_address=None):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO failed_logins (email, ip_address, attempted_at) VALUES (%s, %s, NOW())",
        (email, ip_address)
    )
    conn.commit()
    cur.close()
    conn.close()

def get_failed_login_count(email, window_minutes=10):
    """Returns count of failed logins for this email in the last `window_minutes`."""
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT COUNT(*) FROM failed_logins
        WHERE email = %s
          AND attempted_at > NOW() - INTERVAL '1 minute' * %s
    """, (email, window_minutes))
    count = cur.fetchone()[0]
    cur.close()
    conn.close()
    return count

def get_total_failed_logins():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM failed_logins")
    count = cur.fetchone()[0]
    cur.close()
    conn.close()
    return count

def clear_failed_logins(email):
    """Delete all failed login records for this email (called after successful login)."""
    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM failed_logins WHERE email = %s", (email,))
    conn.commit()
    cur.close()
    conn.close()

def get_failed_logins_by_email():
    """Returns top offending emails by failed login count."""
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        SELECT email, COUNT(*) AS attempts,
               MAX(attempted_at) AS last_attempt
        FROM failed_logins
        GROUP BY email
        ORDER BY attempts DESC
        LIMIT 20
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

# ──────────────────────────────────────────────────────────────────────────────
# Account locking
# ──────────────────────────────────────────────────────────────────────────────

def lock_user_account(email, lock_minutes=30):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        UPDATE users
        SET locked_until = NOW() + INTERVAL '1 minute' * %s
        WHERE email = %s
    """, (lock_minutes, email))
    conn.commit()
    cur.close()
    conn.close()

def is_account_locked(email):
    """Returns (is_locked: bool, locked_until: datetime|None).
    Comparison is done in SQL to avoid Python/DB timezone mismatch."""
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "SELECT locked_until FROM users WHERE email = %s AND locked_until > NOW()",
        (email,)
    )
    row = cur.fetchone()
    cur.close()
    conn.close()
    if row:
        return True, row[0]
    return False, None

# ──────────────────────────────────────────────────────────────────────────────
# Suspicious events
# ──────────────────────────────────────────────────────────────────────────────

SEVERITY_LEVELS = ('low', 'medium', 'high', 'critical')

def log_suspicious_event(event_type, detail, email=None, user_id=None, severity='medium'):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO suspicious_events (user_id, email, event_type, detail, severity, created_at)
        VALUES (%s, %s, %s, %s, %s, NOW())
    """, (user_id, email, event_type, detail, severity))
    conn.commit()
    cur.close()
    conn.close()

def get_all_suspicious_events(limit=100):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        SELECT se.*, u.name, u.email AS user_email
        FROM suspicious_events se
        LEFT JOIN users u ON se.user_id = u.id
        ORDER BY se.created_at DESC
        LIMIT %s
    """, (limit,))
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

def get_recent_suspicious_count(hours=24):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT COUNT(*) FROM suspicious_events
        WHERE created_at > NOW() - INTERVAL '1 hour' * %s
    """, (hours,))
    count = cur.fetchone()[0]
    cur.close()
    conn.close()
    return count

# ──────────────────────────────────────────────────────────────────────────────
# Activity / deletion counting
# ──────────────────────────────────────────────────────────────────────────────

def get_deletion_count(hours=24):
    """Count expense/income deletion log entries in the last N hours."""
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT COUNT(*) FROM logs
        WHERE action ILIKE 'Deleted%%'
          AND timestamp > NOW() - INTERVAL '1 hour' * %s
    """, (hours,))
    count = cur.fetchone()[0]
    cur.close()
    conn.close()
    return count

def get_active_users(hours=24):
    """Users who have a log entry in the last N hours."""
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        SELECT DISTINCT u.id, u.name, u.email,
               MAX(l.timestamp) AS last_activity,
               COUNT(l.id) AS action_count
        FROM logs l
        JOIN users u ON l.user_id = u.id
        WHERE l.timestamp > NOW() - INTERVAL '1 hour' * %s
        GROUP BY u.id, u.name, u.email
        ORDER BY action_count DESC
    """, (hours,))
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

def get_excessive_deleters(threshold=5, hours=1):
    """Find users who deleted more than `threshold` items in `hours` hours."""
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        SELECT u.id, u.name, u.email, COUNT(l.id) AS deletion_count
        FROM logs l
        JOIN users u ON l.user_id = u.id
        WHERE l.action ILIKE 'Deleted%%'
          AND l.timestamp > NOW() - INTERVAL '1 hour' * %s
        GROUP BY u.id, u.name, u.email
        HAVING COUNT(l.id) >= %s
        ORDER BY deletion_count DESC
    """, (hours, threshold))
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows
