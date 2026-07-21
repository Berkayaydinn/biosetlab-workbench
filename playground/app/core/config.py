from starlette.config import Config
from starlette.datastructures import Secret
from pydantic_settings import BaseSettings

config = Config(".env")


class Cfg(BaseSettings):
    """
    - Stores the configuration settings for the application.
    """
    APP_NAME: str = "Web Health Data Platform - Playground Service"
    APP_VERSION: str = "0.0.1"
    API_PREFIX: str = "/api/v1"
    DEBUG: bool = config("DEBUG", cast=bool, default=False)

    # JWT settings
    SECRET_KEY: str = config("SECRET_KEY", cast=str) 
    ALGORITHM: str = config("ALGORITHM", cast=str, default="HS256")

    # MongoDB settings
    MONGO_URI: str = config("MONGO_URI", cast=str)

    # RabbitMQ settings
    RABBITMQ_URI: str = config("RABBITMQ_URI", cast=str)
    
    # Redis settings
    REDIS_URL: str = config("REDIS_URL", cast=str, default="redis://redis:6379/0")


cfg = Cfg()
