from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from twilio.rest import Client
from dotenv import load_dotenv
from flask_apscheduler import APScheduler
from datetime import datetime, timedelta


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True) # Allow requests from frontend react

load_dotenv()

twilio_sid = os.getenv("TWILIO_ACCOUNT_SID")
twilio_token = os.getenv("TWILIO_AUTH_TOKEN")
twilio_number = os.getenv("TWILIO_PHONE")

client = Client(twilio_sid, twilio_token)

#temporary stockage
medicaments = []

scheduler = APScheduler()
scheduler.init_app(app)
scheduler.start()

@app.route('/api/reminders', methods=['GET', 'POST'])
def handle_reminders():
    if request.method == 'POST':
        data = request.get_json()
        name = data.get('name')
        hour = data.get('hour')
        phone = data.get('phone')

        if name and hour and phone:
            medicaments.append({'name': name, 'hour': hour, 'phone': phone})

            try:
                client.messages.create(
                    body=f"Reminder: take {name} at {hour}",
                    from_=twilio_number,
                    to=phone
                )
            except Exception as e:
                print("Erreur Twilio :", e)

            return jsonify({'message': 'Reminder added with success'}), 201

        return jsonify({'error': 'Missing fields'}), 400

    # GET
    return jsonify(medicaments), 200



@app.route('/api/reminders/<int:index>', methods=['DELETE', 'OPTIONS'])
def delete_reminder(index):
    if request.method == 'OPTIONS':
        return '', 200
    try:
        medicaments.pop(index)
        return jsonify({'message': 'Reminder deleted'}), 200
    except IndexError:
        return jsonify({'error': 'Index error'}), 400

def send_sms(to, message):
    client.messages.create(
        body=message,
        from_=twilio_number,
        to=to
    )

def schedule_sms(phone, message, send_time):
    job_id = f"sms_{phone}_{send_time.timestamp()}"
    scheduler.add_job(
        id=job_id,
        func=send_sms,
        args=[phone, message],
        trigger='date',
        run_date=send_time
    )

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
