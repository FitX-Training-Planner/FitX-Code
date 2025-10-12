from flask_socketio import SocketIO
from ..config import RedisConfig

socket_io = SocketIO(
    cors_allowed_origins="*",
    async_mode="eventlet",
    message_queue=f"redis://{RedisConfig.settings['host']}:{RedisConfig.settings['port']}/{RedisConfig.settings['db']}",
    manage_session=False,
    logger=True,
    engineio_logger=True
)
