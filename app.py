from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return render_template("index.html")


# ---------- SMART RESPONSE FUNCTION ----------
def smart_reply(msg):

    msg = msg.lower().strip()
    words = msg.split()

    # ---------- GENERAL ----------
    if any(word in words for word in ["hi", "hello", "holla"]):
        return "Hello, I'm doing great 😊 How can I help you today?"

    if any(word in words for word in ["ok", "okay", "fine"]):
        return "Yes! If you need my help I am just a message away 😊"

    if "how" in words and "are" in words and "you" in words:
        return "I'm doing great 😊 How can I help you today?"

    if "time" in words:
        return f"⏰ Current time is {datetime.datetime.now().strftime('%H:%M')}"

    if "who" in words and "you" in words:
        return "I'm RideMate assistant 🤖 I help you with booking and managing rides"

    if "what" in words and "going" in words:
        return "Everything is running smoothly 😄 How can I assist you?"


    # ---------- AUTH ----------
    if "login" in words:
        return "🔐 To login: Click on MY PROFILE → LOGIN → Enter email & password → Submit"

    if "logout" in words:
        return "👋 To logout: Click on profile icon → Press Logout"

    if "signup" in words or "register" in words:
        return "📝 Use your @banasthali.in email → Create password → Signup"


    # ---------- CREATE RIDE ----------
    if "create" in words or "ride" in words or "offer" in words:
        return """🚗 To create a ride:
1. Go to 'Create Ride'
2. Enter pickup
3. Enter destination
4. Select date & time
5. Add seats
6. Set price
7. Click Submit ✅"""


    # ---------- MY RIDE ----------
    if any(word in words for word in ["ride", "cab", "booking"]):
        if any(word in words for word in ["when", "where", "status", "details"]):
            return "📍 Go to 'My Rides' to check details"


    # ---------- RIDEMATE ----------
    if any(word in words for word in ["book", "reserve"]):
        return """📌 To book a ride:
1. Enter pickup & destination
2. Select date
3. Click search
4. Choose ride
5. Confirm booking ✅"""

    if any(word in words for word in ["search", "find"]):
        return "🔍 Enter pickup, destination and date → Click Search"


    # ---------- HELP ----------
    if any(word in words for word in ["help", "assist", "support"]):
        return """🤖 I can help you with:
• Login / Logout
• Create Ride
• Book Ride
• Cancel Ride
• Ride Details

Just ask your question 😊 or contact us on ridemate7@gmail.com"""


    # ---------- CONTACT ----------
    if any(word in words for word in ["contact", "reach", "email", "phone"]):
        return """📞 Contact Support:
📧 Email: ridemate7@gmail.com


We usually respond within 24 hours ⏳"""


    # ---------- ISSUE ----------
    if "issue" in words or "problem" in words:
        return """⚠️ Facing an issue?
Please describe your problem or contact support:
📧 ridemate7@gmail.com

We'll help you ASAP 🚀"""


    # ---------- OTHER ----------
    if "cancel" in words:
        return "❌ Go to My Profile → Ride History → Upcoming Rides→ Cancel"

    if any(word in words for word in ["price", "cost", "fare"]):
        return "💰 Price = per seat × passengers"

    if "pickup" in words:
        return "📍 Pickup = starting point"

    if any(word in words for word in ["destination", "drop"]):
        return "📍 Destination = where you want to go"

    if "seat" in words:
        return "💺 Seats shown on ride card"

    if "banasthali" in words or "email" in words:
        return "🔐 Only @banasthali.in emails allowed"

    if any(word in words for word in ["upcoming", "future"]):
        return "📅 Check 'My Rides' → Upcoming"

    if "history" in words or "past" in words:
        return "📜 Check 'My Rides' → Completed"

    if "driver" in words:
        return "🚗 Drivers are verified students"

    if "passenger" in words:
        return "👤 Enter name, phone, email while booking"

    if any(word in words for word in ["safe", "safety"]):
        return "🔒 Verified users for safety"

    if "from" in words and "to" in words:
        return "🛣️ Enter route to search rides"

    if "bye" in words:
        return "Goodbye 👋 Have a safe ride!"


    # ---------- FALLBACK ----------
    return """I'm not fully sure, but I can help with:
• Login / Logout
• Create Ride
• Booking
• Cancel
• Ride details

Try simple questions 😊 or, for any further queries contact ridemate7@gmail.com"""


# ---------- CHAT API ----------
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    msg = data.get("message", "")

    reply = smart_reply(msg)

    return jsonify({"reply": reply})


if __name__ == "__main__":
    app.run(port=5050, debug=True)