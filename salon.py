from flask import Flask, request, jsonify,render_template
from flask_cors import CORS
import salonLogic as SL

app = Flask(__name__)
CORS(app)
#hashmap
total ={}

@app.route('/home')
def home():
    return render_template('home.html')


@app.route('/home', methods=["POST"])
def home_page():
    data = request.get_json()
    worker = data.get("worker")
    service = data.get("service")
    amount = float(data.get("amount",0))
    if worker in total:
        total[worker] += amount
    else:
        total[worker]=amount
        

    show_total = SL.show_totals(total)
    
    return jsonify(show_total)

        
    

if __name__ == '__main__':
    app.run(debug=True)
