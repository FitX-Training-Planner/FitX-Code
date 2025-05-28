from flask import Blueprint
import os
import json
from .user import user_bp
from .trainer import trainer_bp
from .security import security_bp

# SHARED_PATH = os.path.join(os.path.dirname(__file__), "..", "shared", "apiRoutes.json")
SHARED_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "..", "shared", "apiRoutes.json")

with open(SHARED_PATH, "r") as file:
    ROUTES = json.load(file)

def register_routes(app):
    app.register_blueprint(user_bp)
    app.register_blueprint(trainer_bp)
    app.register_blueprint(security_bp)
