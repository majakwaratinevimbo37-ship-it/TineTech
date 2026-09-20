import os
import time
import threading
from datetime import datetime

import resend
from flask import Flask, jsonify, render_template, request


app = Flask(__name__)


# =========================================================
# TINETECH CONFIGURATION
# =========================================================

OWNER_EMAIL = os.getenv(
    "OWNER_EMAIL",
    "majakwaratinevimbo37@gmail.com"
)

RESEND_API_KEY = os.getenv("RESEND_API_KEY")

RESEND_FROM = os.getenv(
    "RESEND_FROM",
    "onboarding@resend.dev"
)


# =========================================================
# RESEND
# =========================================================

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY


# =========================================================
# ANONYMOUS VISITOR SYSTEM
# =========================================================

visitor_lock = threading.Lock()

active_visitors = {}

visitor_events = []

MAX_EVENTS = 100

VISITOR_TIMEOUT = 45


def current_time():
    return datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )


def cleanup_visitors():
    now = time.time()

    expired = []

    with visitor_lock:

        for session_id, visitor in list(
            active_visitors.items()
        ):

            if now - visitor["last_seen"] > VISITOR_TIMEOUT:

                expired.append(visitor)

                del active_visitors[session_id]

                visitor_events.insert(
                    0,
                    {
                        "type": "EXITED",
                        "session": session_id[:8],
                        "page": visitor["page"],
                        "time": current_time()
                    }
                )

        del visitor_events[MAX_EVENTS:]


def record_event(
    event_type,
    session_id,
    page
):

    event = {
        "type": event_type,
        "session": session_id[:8],
        "page": page,
        "time": current_time()
    }

    visitor_events.insert(
        0,
        event
    )

    del visitor_events[MAX_EVENTS:]


# =========================================================
# PAGE ROUTES
# =========================================================

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/lab")
def lab():
    return render_template("lab.html")


@app.route("/system")
def system():
    return render_template("system.html")


@app.route("/contact")
def contact():
    return render_template("contact.html")


# =========================================================
# CONTACT / RESEND SYSTEM
# =========================================================

@app.route(
    "/api/contact",
    methods=["POST"]
)
def contact_api():

    data = request.get_json(
        silent=True
    ) or {}

    name = str(
        data.get("name", "")
    ).strip()

    email = str(
        data.get("email", "")
    ).strip()

    project = str(
        data.get("project", "")
    ).strip()

    message = str(
        data.get("message", "")
    ).strip()

    if not name:
        return jsonify({
            "success": False,
            "error": "Name is required."
        }), 400

    if not email:
        return jsonify({
            "success": False,
            "error": "Email is required."
        }), 400

    if not project:
        return jsonify({
            "success": False,
            "error": "Project is required."
        }), 400

    if not message:
        return jsonify({
            "success": False,
            "error": "Message is required."
        }), 400

    if not RESEND_API_KEY:

        return jsonify({
            "success": False,
            "error": "Email service is not configured."
        }), 500

    try:

        resend.Emails.send({
            "from": RESEND_FROM,
            "to": [OWNER_EMAIL],
            "reply_to": email,
            "subject": (
                f"TineTech Project Inquiry — {project}"
            ),
            "html": f"""
                <h2>New TineTech Project Inquiry</h2>

                <p>
                    <strong>Name:</strong>
                    {name}
                </p>

                <p>
                    <strong>Email:</strong>
                    {email}
                </p>

                <p>
                    <strong>Project:</strong>
                    {project}
                </p>

                <hr>

                <p>
                    <strong>Message:</strong>
                </p>

                <p>
                    {message.replace(chr(10), "<br>")}
                </p>
            """
        })

        return jsonify({
            "success": True
        })

    except Exception as error:

        print(
            "Resend error:",
            error
        )

        return jsonify({
            "success": False,
            "error": "Unable to send message."
        }), 500


# =========================================================
# VISITOR ENTER
# =========================================================

@app.route(
    "/api/visitor/enter",
    methods=["POST", "OPTIONS"]
)
def visitor_enter():

    if request.method == "OPTIONS":
        response = jsonify({})
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers[
            "Access-Control-Allow-Headers"
        ] = "Content-Type"
        return response

    data = request.get_json(
        silent=True
    ) or {}

    session_id = str(
        data.get("session_id", "")
    ).strip()

    page = str(
        data.get("page", "/")
    ).strip()

    if not session_id:
        return jsonify({
            "success": False
        }), 400

    with visitor_lock:

        active_visitors[session_id] = {
            "page": page,
            "started": time.time(),
            "last_seen": time.time()
        }

        record_event(
            "ENTERED",
            session_id,
            page
        )

    response = jsonify({
        "success": True,
        "status": "ENTERED"
    })

    response.headers[
        "Access-Control-Allow-Origin"
    ] = "*"

    return response


# =========================================================
# VISITOR HEARTBEAT
# =========================================================

@app.route(
    "/api/visitor/pulse",
    methods=["POST", "OPTIONS"]
)
def visitor_pulse():

    if request.method == "OPTIONS":
        response = jsonify({})
        response.headers[
            "Access-Control-Allow-Origin"
        ] = "*"
        return response

    data = request.get_json(
        silent=True
    ) or {}

    session_id = str(
        data.get("session_id", "")
    ).strip()

    page = str(
        data.get("page", "/")
    ).strip()

    if not session_id:
        return jsonify({
            "success": False
        }), 400

    with visitor_lock:

        visitor = active_visitors.get(
            session_id
        )

        if visitor:

            visitor["last_seen"] = time.time()
            visitor["page"] = page

        else:

            active_visitors[session_id] = {
                "page": page,
                "started": time.time(),
                "last_seen": time.time()
            }

            record_event(
                "ENTERED",
                session_id,
                page
            )

    response = jsonify({
        "success": True,
        "status": "ACTIVE"
    })

    response.headers[
        "Access-Control-Allow-Origin"
    ] = "*"

    return response


# =========================================================
# VISITOR EXIT
# =========================================================

@app.route(
    "/api/visitor/leave",
    methods=["POST", "OPTIONS"]
)
def visitor_leave():

    if request.method == "OPTIONS":
        response = jsonify({})
        response.headers[
            "Access-Control-Allow-Origin"
        ] = "*"
        return response

    data = request.get_json(
        silent=True
    ) or {}

    session_id = str(
        data.get("session_id", "")
    ).strip()

    page = str(
        data.get("page", "/")
    ).strip()

    if not session_id:
        return jsonify({
            "success": False
        }), 400

    with visitor_lock:

        visitor = active_visitors.pop(
            session_id,
            None
        )

        if visitor:
            page = visitor["page"]

        record_event(
            "EXITED",
            session_id,
            page
        )

    response = jsonify({
        "success": True,
        "status": "EXITED"
    })

    response.headers[
        "Access-Control-Allow-Origin"
    ] = "*"

    return response


# =========================================================
# VISITOR TELEMETRY
# =========================================================

@app.route(
    "/api/visitors",
    methods=["GET"]
)
def visitors_api():

    cleanup_visitors()

    with visitor_lock:

        visitors = []

        for session_id, visitor in (
            active_visitors.items()
        ):

            visitors.append({
                "session": session_id[:8],
                "page": visitor["page"],
                "duration": round(
                    time.time()
                    - visitor["started"]
                )
            })

        events = list(
            visitor_events[:50]
        )

    response = jsonify({
        "success": True,
        "active_count": len(visitors),
        "visitors": visitors,
        "events": events,
        "server_time": current_time()
    })

    response.headers[
        "Access-Control-Allow-Origin"
    ] = "*"

    return response


# =========================================================
# RUN
# =========================================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=int(
            os.getenv(
                "PORT",
                5000
            )
        )
    )