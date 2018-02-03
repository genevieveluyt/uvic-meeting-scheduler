import os
from flask import Flask

from .helpers.db_interface import UvicSchedulerDBInterface
from .env import Config

app = Flask(__name__)

app.config.from_object(Config)

app.config.update(
    APP_ROOT = os.path.dirname(os.path.abspath(__file__)),
    VERBOSE=True,
    DB_USER=os.environ.get('POSTGRES_USER', app.config.get('DB_USER')),
    DB_PASSWORD=os.environ.get('POSTGRES_PASSWORD', app.config.get('DB_PASSWORD'))
)

db_interface = UvicSchedulerDBInterface(app.config.get('DB_USER'), app.config.get('DB_PASSWORD'))

from . import routes
