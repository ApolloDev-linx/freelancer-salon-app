from flask import Flask, request, jsonify,render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/home')
def home():
    return render_template('home.html')


@app.route('/home', methods=["POST"])
def home_page():
    data = request.get_json()
    worker = data["worker"]
    service = data["service"]
    amount = data["amount"]

    return jsonify({
        "worker": worker,
        "service": service,
        "amount": amount

        })
    









if __name__ == '__main__':
    app.run(debug=True)
