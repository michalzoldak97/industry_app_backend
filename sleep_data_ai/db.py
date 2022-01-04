import os
from flaskext.mysql import MySQL
from app import app

MYSQL_DATABASE_USER = os.environ.get('MYSQL_USER')
MYSQL_DATABASE_PASSWORD = os.environ.get('MYSQL_PASSWORD')
MYSQL_DATABASE_DB = os.environ.get('MYSQL_DATABASE')


def _print_env():
    return MYSQL_DATABASE_USER, MYSQL_DATABASE_PASSWORD, MYSQL_DATABASE_DB


def configure_app(a):
    a.config['MYSQL_DATABASE_HOST'] = 'mysql'
    a.config['MYSQL_DATABASE_PORT'] = 3306
    a.config['MYSQL_DATABASE_USER'] = MYSQL_DATABASE_USER
    a.config['MYSQL_DATABASE_PASSWORD'] = MYSQL_DATABASE_PASSWORD
    a.config['MYSQL_DATABASE_DB'] = MYSQL_DATABASE_DB


configure_app(app)
mysql = MySQL()
mysql.init_app(app)
conn = mysql.connect()
