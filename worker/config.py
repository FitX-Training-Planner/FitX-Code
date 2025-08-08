import os

class SQLAlchemyConfig:
    DB_URL = os.getenv("MYSQL_URL")

    if DB_URL and DB_URL.startswith("mysql://"):
        DB_URL = DB_URL.replace("mysql://", "mysql+pymysql://")

    SQLALCHEMY_DATABASE_URI = DB_URL