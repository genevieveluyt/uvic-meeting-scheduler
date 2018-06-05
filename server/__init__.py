import os
from flask import Flask

from .helpers.db_interface import UvicSchedulerDBInterface

app = Flask(__name__)

app.config.update(
    APP_ROOT = os.path.dirname(os.path.abspath(__file__)),
    VERBOSE=(os.environ.get('FLASK_ENV') == 'development'),
    DB_USER=os.environ.get('POSTGRES_USER'),
    DB_PASSWORD=os.environ.get('POSTGRES_PASSWORD')
)

db_interface = UvicSchedulerDBInterface(app.config.get('DB_USER'), app.config.get('DB_PASSWORD'))

from . import routes
