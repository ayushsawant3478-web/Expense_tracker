import os
import sys
from dotenv import load_dotenv

# We need to add the current directory to sys.path so we can import from models
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

from models.user import create_user, get_user_by_email, update_user_role
from flask_bcrypt import Bcrypt
from flask import Flask

app = Flask(__name__)
bcrypt = Bcrypt(app)

admin_email = os.getenv("ADMIN_EMAIL")
admin_password = os.getenv("ADMIN_PASSWORD")
admin_name = os.getenv("ADMIN_NAME", "Admin")

if not admin_email or not admin_password:
    raise ValueError("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables.")

def setup_admin():
    user = get_user_by_email(admin_email)
    if not user:
        print(f"Creating admin user: {admin_email}")
        hashed_password = bcrypt.generate_password_hash(admin_password).decode('utf-8')
        # create_user by default gives 'user' role
        create_user(admin_name, admin_email, hashed_password, role='admin')
        print("Admin user created.")
    else:
        print(f"User {admin_email} already exists. Updating role to admin.")
        update_user_role(user['id'], 'admin')
        print("Role updated.")

if __name__ == "__main__":
    with app.app_context():
        setup_admin()
