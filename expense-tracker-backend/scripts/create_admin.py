import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.user import create_user, get_user_by_email
from flask_bcrypt import Bcrypt
bcrypt = Bcrypt()

def main():
    admin_exists = get_user_by_email('admin@trackify.com')
    if admin_exists:
        print('Admin account already exists!')
        return

    admin_password = bcrypt.generate_password_hash('admin123').decode('utf-8')
    create_user('Admin', 'admin@trackify.com', admin_password, role='admin')

    user_exists = get_user_by_email('user@trackify.com')
    if not user_exists:
        user_password = bcrypt.generate_password_hash('user123').decode('utf-8')
        create_user('TestUser', 'user@trackify.com', user_password, role='user')

    print('Admin and user accounts created!')
    print('Admin: admin@trackify.com / admin123')
    print('User: user@trackify.com / user123')

if __name__ == '__main__':
    main()