from flask import Blueprint, render_template, request, flash, jsonify
from flask_login import login_required,current_user
from .models import Score
from . import db
import json

views=Blueprint('views',__name__)

@views.route('/',methods=['GET','POST'])
@login_required
def home():
    score_table=Score.query.filter_by(user_id=current_user.id).all()
    if score_table:
        user_max_score = max(score.score for score in score_table)
    else:
        user_max_score = -1
    total_scores=Score.query.all()
    top_scores=[]
    for i in total_scores:
        if(len(top_scores)<5):
            top_scores.append([i.score,i.user_name,i.date])
        elif(i.score>top_scores[0][0]):
            top_scores.pop(0)
            top_scores.append([i.score,i.user_name,i.date])
        elif(i.score==top_scores[0][0] and i.date>top_scores[0][2]):
            top_scores.pop(0)
            top_scores.append([i.score,i.user_name,i.date])
        top_scores.sort(key=lambda x: x[0])
    top_scores.sort(key=lambda x: x[0], reverse=True)
    return render_template("home.html",user=current_user,user_max_score=user_max_score,top_scores=top_scores)
    #return render_template("home.html",user=current_user,user_max_score=user_max_score)

@views.route('/add-score',methods=['POST'])
def add_score():
    score=json.loads(request.data)
    new_score=score['score']
    novel_score=Score(score=new_score,user_id=current_user.id,user_name=current_user.first_name)
    db.session.add(novel_score)
    db.session.commit()
    return render_template("home.html",user=current_user)
