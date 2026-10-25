from celery import Celery
from app.core.config import cfg

app = Celery('tasks', broker=cfg.RABBITMQ_URI)
app.autodiscover_tasks(["app.tasks"])

app.conf.update(
    result_backend=cfg.REDIS_URL,
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
)

if __name__ == '__main__':
    app.start()