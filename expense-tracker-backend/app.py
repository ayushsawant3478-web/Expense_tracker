import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
from routes.auth_routes import auth_bp
from routes.expense_routes import expense_bp
from routes.income_routes import income_bp
from routes.budget_routes import budget_bp
from routes.market_routes import market_bp
from routes.goal_routes import goal_bp
from routes.admin_routes import admin_bp
from models.user import create_users_table
from models.expense import create_expenses_table
from models.income import create_income_table
from models.budget import create_budgets_table
from models.goal import create_goals_table
from models.logs import create_logs_table
from models.security import create_security_tables
from models.session import create_session_tables
from config import Config

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

jwt = JWTManager(app)
bcrypt = Bcrypt(app)

CORS(
    app,
    resources={r"/*": {"origins": [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://127.0.0.1:5173",
        "https://trackify-beta.vercel.app",
        "https://*.vercel.app"
    ]}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

app.register_blueprint(auth_bp)
app.register_blueprint(expense_bp)
app.register_blueprint(income_bp)
app.register_blueprint(budget_bp)
app.register_blueprint(market_bp)
app.register_blueprint(goal_bp)
app.register_blueprint(admin_bp)

@app.route("/")
def home():
    return "Backend is running 🚀"

with app.app_context():
    try:
        create_users_table()
        create_expenses_table()
        create_income_table()
        create_budgets_table()
        create_goals_table()
        create_logs_table()
        create_security_tables()
        create_session_tables()
        # Create indexes for common queries (safe to run repeatedly)
        from database.db import get_db
        conn = get_db()
        cur = conn.cursor()
        cur.execute("CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_income_user_id ON income(user_id);")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_income_date ON income(date DESC);")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_logs_user_id ON logs(user_id);")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp DESC);")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_logs_action ON logs(action);")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_suspicious_events_created_at ON suspicious_events(created_at DESC);")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_failed_logins_email ON failed_logins(email);")
        conn.commit()
        cur.close()
        conn.close()
        print("All tables and indexes ready!")
    except Exception as e:
        print(f"Error during table creation: {e}")
        print("Make sure your DATABASE_URL is correct and accessible.")

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    app.run(debug=True, host="0.0.0.0", port=port)

