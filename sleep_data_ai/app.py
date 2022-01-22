from flask import Flask
from flask_wtf.csrf import CSRFProtect
import os

app = Flask(__name__)
app.config.update(SECRET_KEY=os.environ.get('JWT_SECRET'))
csrf = CSRFProtect()
csrf.init_app(app)