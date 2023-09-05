from boggle import Boggle
from flask import Flask, request, render_template, session, redirect, request, jsonify

app = Flask(__name__)
boggle_game = Boggle()
app.secret_key = "secretKey"

@app.route("/boggle")
def boggle():
    board = boggle_game.make_board()
    session["board"] = board
    return render_template("game.html", board=board)

@app.route("/submit", methods=["POST"])
def submit():
    req = request.json
    guess = req["guess"]
    if guess in boggle_game.words:
        if boggle_game.check_valid_word(session["board"], guess) == "ok":
            return jsonify({"result": "ok"})
        else:
            return jsonify({"result": "not-on-board"})
    else:
        return jsonify({"result": "not-a-word"})
    
@app.route("/stats", methods=["POST"])
def collect():
    req = request.json
    if 'high_score' not in session:
        session["high_score"] = 0
    if req["scoreCount"] > session["high_score"]:
        session["high_score"] = req["scoreCount"]
    if 'visit_count' not in session:
        session['visit_count'] = 0
    session["visit_count"] += 1
    return jsonify({"high_score": f"{session['high_score']}", "num_visits": f"{session['visit_count']}"})
