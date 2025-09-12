from ..__init__ import fernet, bcrypt, sg
import hashlib
from ..database.models import Users
import os
from sendgrid.helpers.mail import Mail
from ..config import SendGridConfig
from datetime import datetime
from zoneinfo import ZoneInfo

brazil_tz = ZoneInfo("America/Sao_Paulo")

def hash_email(email):
    combination = (email.lower() + os.getenv("HASHLIB_SALT")).encode("utf-8")

    return hashlib.sha256(combination).hexdigest()

def is_email_used(db, email):
    email_hash = hash_email(email)

    return db.query(Users).filter(Users.email_hash == email_hash).first() is not None

def encrypt_email(email):
    return fernet.encrypt(email.encode("utf-8"))

def decrypt_email(encrypted_email):
    return fernet.decrypt(encrypted_email).decode("utf-8")

def hash_password(password):
    return bcrypt.generate_password_hash(password).decode("utf-8")

def check_password(password, hashed):
    return bcrypt.check_password_hash(hashed, password)

def send_email_with_template(to_email, template_id, dynamic_data = {}):
    try:
        message = Mail(
            from_email=SendGridConfig.SENDGRID_SENDER_EMAIL,
            to_emails=to_email
        )
        message.template_id = template_id
        message.dynamic_template_data = dynamic_data

        sg.send(message)
       
    except Exception as e:
        print(f"Erro ao enviar e-mail: {e}")

def calculate_age(birth_date):
    if not birth_date:
        return None
    
    today = datetime.now(brazil_tz).date()
    
    return today.year - birth_date.year - (
        (today.month, today.day) < (birth_date.month, birth_date.day)
    )
