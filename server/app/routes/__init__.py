from .user import user_bp
from .trainer import trainer_bp
from .security import security_bp

def register_routes(app):
    app.register_blueprint(user_bp)
    app.register_blueprint(trainer_bp)
    app.register_blueprint(security_bp)
