from dotenv import load_dotenv
from flask import Flask, request, jsonify,render_template
from flask_cors import CORS
import uuid
import psycopg2
from psycopg2.extras import RealDictCursor
import os
app = Flask(__name__)
CORS(app)
#hashmap
load_dotenv()

def get_conn():
    return psycopg2.connect(
            host = os.getenv("PGHOST"),
            dbname = os.getenv("PGDATABASE"),
            user = os.getenv("PGUSER"),
            password = os.getenv("PGPASSWORD")

            )



def save_entry(data):
    
    
    
    sql =""" 
              INSERT INTO salon_entries (id, worker, service, amount, tip, day)
              VALUES (%s::uuid,%s,%s,%s,%s,%s)
              """

    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(sql,(
                data["id"],
                data["worker"],
                data["service"],
                data["amount"],
                data["tip"],
                data["day"]
                ))


@app.route("/submit", methods=["POST"])
def submit():
    data = request.get_json()

    clean_data = {
            "id": str(uuid.uuid4()),
            "worker": data.get("worker", "").strip().lower(),
            "service": data.get("service", "").strip(),
            "amount": float(data.get("amount", 0)),
            "tip": float(data.get("tip", 0)),
            "day": data.get("day", "").strip()
            }
    save_entry(clean_data)
    return jsonify({"status": "ok"})


@app.route("/summary", methods=["GET"])
def summary():
    conn = sqlite3.connect("salon.db")
    conn.row_factory = sqlite3.Row
    c = conn.cursor()

    c.execute("""
        SELECT worker, SUM(amount) AS total, SUM(tip) AS tips
        FROM salon_entries
        GROUP BY worker
    """)

    results = c.fetchall()
    conn.close()

    # Convert rows to list of dicts
    summary_data = [dict(row) for row in results]

    return jsonify(summary_data)


def _build_payload():
    conn = sqlite3.connect("salon.db")
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    # build days
    c.execute("SELECT * FROM salon_entries")
    all_entries = c.fetchall()
    days = {"Monday": [],"Tuesday": [], "Wednesday": [], "Thursday":[], "Friday": [], "Saturday": []}
    for entry in all_entries:
        day = entry["day"]
        if day in days:
            days[day].append(dict(entry))

    # Build tips and total
    c.execute("SELECT worker, SUM(tip) as tip, SUM(amount) as total FROM salon_entries GROUP BY worker ")
    rows = c.fetchall()
    tips = {}
    total = {}
    for row in rows:
        worker = row["worker"]
        tips[worker] = row["tip"]
        total[worker] = row["total"]

    conn.close()
    return {"days": days, "tips": tips, "total": total}

   

@app.route('/data')
def get_data():
    return jsonify(_build_payload())

@app.route('/home')
def home():
    return render_template('home.html')


@app.route('/')
def index():
    return home()

        
@app.route('/reset', methods=["POST"])
def reset():
    conn = sqlite3.connect("salon.db")
    c = conn.cursor()
    c.execute("DELETE FROM salon_entries")
    conn.commit()
    conn.close()
    return jsonify(_build_payload())

@app.route('/deleteEntry', methods=['POST'])
def delete_entry():
    data = request.get_json()
    entry_id = data.get("id")
    conn = sqlite3.connect("salon.db")
    c = conn.cursor()
    c.execute("DELETE FROM salon_entries WHERE id = ?", (entry_id,))
    conn.commit()
    conn.close()
    return jsonify(_build_payload()), 200


if __name__ == '__main__':
    app.run(debug=True)
