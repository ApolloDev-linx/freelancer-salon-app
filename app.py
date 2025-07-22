from flask import Flask, request, jsonify,render_template
from flask_cors import CORS
import uuid

app = Flask(__name__)
CORS(app)
#hashmap

tips = {}
total ={}
days ={
        "Monday": [],
        "Tuesday": [],
        "Wednesday":[],
        "Thursday":[],
        "Friday":[],
        "Saturday":[]}


def _build_payload():
    return{
            "days":days,
            "total":total,
            "tips":tips }

@app.route('/data')
def get_data():
    return jsonify(_build_payload())

@app.route('/home')
def home():
    return render_template('home.html')


@app.route('/')
def index():
    return home()

@app.route('/home', methods=["POST"])
def home_page():
    data = request.get_json()
    worker = data.get("worker", "").strip().lower()
    service = data.get("service")
    amount = float(data.get("amount",0))
    tip = float(data.get("tip",0))
    day = data.get("day")

    entry = {"worker":worker, "service": service, "amount":amount, "tip":tip, "id": str(uuid.uuid4())}
    
    if day in days:
        days[day].append(entry)
    tips[worker] = tips.get(worker,0) + tip
    total[worker] = total.get(worker,0)+ amount
    return jsonify(_build_payload())


                            

        
@app.route('/reset',methods =["POST"])
def reset():
    days.clear()
    days.update({
        "Monday":[],
        "Tuesday":[],
        "Wednesday":[],
        "Thursday":[],
        "Friday":[],
        "Saturday": []

        })
    total.clear()
    tips.clear()
    return jsonify(_build_payload())


@app.route('/deleteEntry', methods=['POST'])
def delete_entry():
    data = request.get_json()
    entry_id = data.get("id")
    removed = None

    for day, entries in days.items():
        new_entries = []
        for entry in entries:
            if entry.get("id") == entry_id and removed is None:
                removed = entry
                continue
            new_entries.append(entry)
        days[day] = new_entries
        if removed:
            print(f"Deleted entry with id {entry_id}from {day}")
            break
    if removed:
        w = removed["worker"]
        total[w]= total.get(w,0) - removed["amount"]
        tips[w] = tips.get(w,0) - removed["tip"]
        if round(total[w],2) <= 0:
            del total[w]
        if round(tips[w],2 ) <= 0:
            del tips[w]
    return jsonify(_build_payload()), 200


if __name__ == '__main__':
    app.run(debug=True)
