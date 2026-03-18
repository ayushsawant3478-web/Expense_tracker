from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import os
from flask import Blueprint, request, jsonify
from models.user import create_user, get_user_by_email
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
import secrets

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

@auth_bp.route('/auth/google', methods=['POST', 'OPTIONS'])
def google_login():

    # ✅ Handle preflight request
    if request.method == 'OPTIONS':
        return '', 200

    try:
        data = request.get_json()
        token = data.get('credential')

        id_info = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            os.getenv("GOOGLE_CLIENT_ID")
        )

        email = id_info.get('email')
        name = id_info.get('name', email.split('@')[0])

        user = get_user_by_email(email)

        if not user:
            hashed = bcrypt.generate_password_hash(
                secrets.token_hex(16)
            ).decode('utf-8')

            create_user(name, email, hashed)
            user = get_user_by_email(email)

        access_token = create_access_token(identity=str(user['id']))

        return jsonify({
            "token": access_token,
            "user": {
                "id": user['id'],
                "name": user['name'],
                "email": user['email']
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400