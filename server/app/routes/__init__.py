from .user import user_bp
from .trainer import trainer_bp
from .security import security_bp
from .training import training_bp
from .client import client_bp

def register_routes(app):
    app.register_blueprint(user_bp)
    app.register_blueprint(trainer_bp)
    app.register_blueprint(security_bp)
    app.register_blueprint(training_bp)
    app.register_blueprint(client_bp)
