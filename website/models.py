from . import db 
from flask_login import UserMixin
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSON 

class Score(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    score=db.Column(db.Integer)
    date=db.Column(db.DateTime(timezone=True), default=func.now())
    user_id=db.Column(db.Integer, db.ForeignKey('user.id'))
    user_name=db.Column(db.String(150))

class User(db.Model,UserMixin):
    id=db.Column(db.Integer, primary_key=True)
    email=db.Column(db.String(150), unique=True)
    password=db.Column(db.String(150))
    first_name=db.Column(db.String(150), unique=True)
    scores=db.relationship('Score')
