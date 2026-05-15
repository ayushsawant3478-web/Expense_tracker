import psycopg2
import psycopg2.extras
import psycopg2.pool
import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

_pool: Optional[psycopg2.pool.ThreadedConnectionPool] = None


def _get_pool() -> psycopg2.pool.ThreadedConnectionPool:
    global _pool
    if _pool is None or _pool.closed:
        db_url = os.getenv("DATABASE_URL")
        _pool = psycopg2.pool.ThreadedConnectionPool(
            minconn=2,
            maxconn=10,
            dsn=db_url,
            connect_timeout=30,
            keepalives=1,
            keepalives_idle=30,
            keepalives_interval=10,
            keepalives_count=5,
        )
    return _pool


class _PooledConnection:
    """
    Thin wrapper around a real psycopg2 connection borrowed from the pool.
    Calling .close() on this wrapper returns the connection to the pool
    instead of destroying it — making all existing model code (which calls
    conn.close()) work transparently with pooling.
    """
    __slots__ = ("_conn", "_pool")

    def __init__(self, conn, pool):
        self._conn = conn
        self._pool = pool

    # ── Delegation ────────────────────────────────────────────────────────────
    def cursor(self, *args, **kwargs):
        return self._conn.cursor(*args, **kwargs)

    def commit(self):
        return self._conn.commit()

    def rollback(self):
        return self._conn.rollback()

    def reset(self):
        return self._conn.reset()

    @property
    def closed(self):
        return self._conn.closed

    # ── Pool return ───────────────────────────────────────────────────────────
    def close(self):
        """Return connection to pool instead of closing it."""
        try:
            if not self._conn.closed:
                self._conn.reset()   # rollback any uncommitted work
            self._pool.putconn(self._conn)
        except Exception:
            try:
                self._conn.close()
            except Exception:
                pass


def get_db() -> _PooledConnection:
    """
    Borrow a connection from the pool wrapped in _PooledConnection.
    All existing model code calls conn.close() which now returns it to the pool.
    The timezone is set once per physical connection via a startup SQL command.
    """
    pool = _get_pool()
    conn = pool.getconn()

    # Set timezone on fresh connections (no-op overhead on warm ones)
    try:
        cur = conn.cursor()
        cur.execute("SET timezone = 'Asia/Kolkata';")
        conn.commit()
        cur.close()
    except Exception:
        pass

    return _PooledConnection(conn, pool)


def put_db(conn: _PooledConnection):
    """Explicitly return a pooled connection (alias for conn.close())."""
    conn.close()