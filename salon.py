from flask import Flask, request, jsonify,render_template
from flask_cors import CORS
import salonLogic as SL

app = Flask(__name__)
CORS(app)
#hashmap
total ={}
days ={
        "Monday": [],
        "Tuesday": [],
        "Wednesday":[],
        "Thursday":[],
        "Friday":[],
        "Saturday":[]}

@app.route('/home')
def home():
    return render_template('home.html')


@app.route('/home', methods=["POST"])
def home_page():
    data = request.get_json()
    worker = data.get("worker")
    service = data.get("service")
    amount = float(data.get("amount",0))
    day = data.get("day")

    entry = {"worker":worker, "service": service, "amount":amount}

    if day in days:
        days[day].append(entry)
    





    if worker in total:
        total[worker] += amount
    else:
        total[worker]=amount
        

    
    return jsonify({ "totals":[{"worker":worker, "amount": round(amount,2)}
                      for worker, amount in total.items()],
                    "days":days,
                    "total":total
                    })
                            

        
@app.route('/reset',methods =["POST"])
def reset():
    days.clear()
    days.update({
        "Monday":[],
        "Tuesday":[],
        "Wednesday":[],
        "Thurday":[],
        "Friday":[],
        "Saturday": []

        })
    total.clear()
    return jsonify({"message":"Reset complete"})

if __name__ == '__main__':
    app.run(debug=True)
