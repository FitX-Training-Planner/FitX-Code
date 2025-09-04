from ..__init__ import fernet, bcrypt, mail
import hashlib
from ..database.models import Users
from ..exceptions.api_error import ApiError
from flask_mail import Message
from flask import render_template
import os

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

def send_email(email, template, subject):
    try:
        message = Message(
            subject=subject,
            recipients=[email],
            html=template
        )
        message.charset = 'utf-8'

        mail.send(message)

    except Exception as e:
        print(f"Erro ao enviar e-mail: {e}")