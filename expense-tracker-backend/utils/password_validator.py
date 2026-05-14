"""
Password strength validation with detailed feedback.
"""
import re

MIN_LENGTH = 8

def validate_password(password: str) -> dict:
    """
    Returns {
        'valid': bool,
        'score': int (0-5),
        'errors': [str],
        'strength': 'weak' | 'fair' | 'good' | 'strong'
    }
    """
    errors = []
    score = 0

    if len(password) >= MIN_LENGTH:
        score += 1
    else:
        errors.append(f'Must be at least {MIN_LENGTH} characters')

    if re.search(r'[A-Z]', password):
        score += 1
    else:
        errors.append('Must contain at least one uppercase letter')

    if re.search(r'[a-z]', password):
        score += 1
    else:
        errors.append('Must contain at least one lowercase letter')

    if re.search(r'\d', password):
        score += 1
    else:
        errors.append('Must contain at least one number')

    if re.search(r'[!@#$%^&*()_+\-=\[\]{};\':\"\\|,.<>\/?~`]', password):
        score += 1
    else:
        errors.append('Must contain at least one special character (!@#$%^&*...)')

    if score <= 1:
        strength = 'weak'
    elif score <= 2:
        strength = 'fair'
    elif score <= 3:
        strength = 'good'
    else:
        strength = 'strong'

    return {
        'valid': len(errors) == 0,
        'score': score,
        'errors': errors,
        'strength': strength
    }
