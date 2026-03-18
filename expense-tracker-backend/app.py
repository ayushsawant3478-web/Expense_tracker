import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv

# Import routes
from routes.auth_routes import auth_bp
from routes.expense_routes import expense_bp
from routes.income_routes import income_bp
from routes.budget_routes import budget_bp
from routes.market_routes import market_bp
from routes.goal_routes import goal_bp

# Import models
from models.user import create_users_table
from models.expense import create_expenses_table
from models.income import create_income_table
from models.budget import create_budgets_table
from models.goal import create_goals_table

# Config
from config import Config

# Load env
load_dotenv()

# Initialize app
app = Flask(__name__)
app.config.from_object(Config)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

# Extensions
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# ✅ FIXED CORS
CORS(
    app,
    resources={r"/*": {"origins": [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://vittvantagee.vercel.app"
    ]}},
    supports_credentials=True
)

# Register routes
app.register_blueprint(auth_bp)
app.register_blueprint(expense_bp)
app.register_blueprint(income_bp)
app.register_blueprint(budget_bp)
app.register_blueprint(market_bp)
app.register_blueprint(goal_bp)

# Root route
@app.route("/")
def home():
    return "Backend is running 🚀"

# Create tables
with app.app_context():
    create_users_table()
    create_expenses_table()
    create_income_table()
    create_budgets_table()
    create_goals_table()
    print("All tables ready!")

# Local run
if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    app.run(debug=True, port=port)