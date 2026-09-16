import os

import resend
from flask import Flask, render_template, request, jsonify


app = Flask(__name__)


# =========================================================
# PRIVATE EMAIL CONFIGURATION
# =========================================================

OWNER_EMAIL = os.environ.get(
    "OWNER_EMAIL",
    "majakwaratinevimbo37@gmail.com"
)

RESEND_API_KEY = os.environ.get("RESEND_API_KEY")

# Resend provides this sender for testing.
# For production/custom sending, this can later be replaced
# with a verified TineTech domain.
RESEND_FROM = os.environ.get(
    "RESEND_FROM",
    "onboarding@resend.dev"
)


# =========================================================
# WEBSITE PAGES
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
# CONTACT API
# =========================================================

@app.route("/api/contact", methods=["POST"])
def api_contact():

    try:

        # -------------------------------------------------
        # CHECK RESEND CONFIGURATION
        # -------------------------------------------------

        if not RESEND_API_KEY:
            print("EMAIL ERROR: RESEND_API_KEY is missing.")

            return jsonify({
                "error": "Email system is not configured yet."
            }), 500


        # -------------------------------------------------
        # READ FORM DATA
        # -------------------------------------------------

        data = request.get_json(silent=True)

        if not data:
            return jsonify({
                "error": "Invalid request."
            }), 400


        name = str(
            data.get("name", "")
        ).strip()

        sender_email = str(
            data.get("email", "")
        ).strip()

        project = str(
            data.get("project", "")
        ).strip()

        message = str(
            data.get("message", "")
        ).strip()


        # -------------------------------------------------
        # VALIDATION
        # -------------------------------------------------

        if not name:
            return jsonify({
                "error": "Please enter your name."
            }), 400

        if not sender_email:
            return jsonify({
                "error": "Please enter your email."
            }), 400

        if not project:
            return jsonify({
                "error": "Please select a project type."
            }), 400

        if not message:
            return jsonify({
                "error": "Please enter your message."
            }), 400


        if len(name) > 100:
            return jsonify({
                "error": "Name is too long."
            }), 400

        if len(sender_email) > 150:
            return jsonify({
                "error": "Email is too long."
            }), 400

        if len(message) > 5000:
            return jsonify({
                "error": "Message is too long."
            }), 400


        # -------------------------------------------------
        # CONNECT TO RESEND
        # -------------------------------------------------

        resend.api_key = RESEND_API_KEY


        # -------------------------------------------------
        # EMAIL CONTENT
        # -------------------------------------------------

        email_params = {
            "from": RESEND_FROM,

            "to": [
                OWNER_EMAIL
            ],

            "reply_to": sender_email,

            "subject": (
                f"TineTech Project Inquiry — {project}"
            ),

            "html": f"""
<!DOCTYPE html>

<html>

<head>
    <meta charset="UTF-8">
    <title>TineTech Project Inquiry</title>
</head>

<body
    style="
        margin:0;
        padding:40px;
        background:#f4f4f0;
        font-family:Arial,Helvetica,sans-serif;
        color:#111;
    "
>

    <div
        style="
            max-width:700px;
            margin:0 auto;
            background:#ffffff;
            padding:40px;
            border-radius:16px;
        "
    >

        <div
            style="
                font-size:13px;
                letter-spacing:2px;
                font-weight:bold;
                margin-bottom:30px;
            "
        >
            TINETECH
        </div>


        <h1
            style="
                margin:0 0 30px 0;
                font-size:32px;
            "
        >
            New Project Inquiry
        </h1>


        <div
            style="
                padding:20px;
                background:#f5f5f5;
                border-radius:12px;
                margin-bottom:20px;
            "
        >

            <strong>NAME</strong>

            <p>
                {name}
            </p>


            <strong>EMAIL</strong>

            <p>
                {sender_email}
            </p>


            <strong>PROJECT</strong>

            <p>
                {project}
            </p>

        </div>


        <div>

            <strong>MESSAGE</strong>

            <p
                style="
                    line-height:1.7;
                    white-space:pre-wrap;
                "
            >
                {message}
            </p>

        </div>


        <hr
            style="
                margin:35px 0;
                border:0;
                border-top:1px solid #ddd;
            "
        >


        <p
            style="
                font-size:12px;
                color:#777;
            "
        >
            Sent through the private TineTech website
            communication system.
        </p>

    </div>

</body>

</html>
"""
        }


        # -------------------------------------------------
        # SEND EMAIL
        # -------------------------------------------------

        response = resend.Emails.send(
            email_params
        )


        print(
            "EMAIL SUCCESS: "
            "TineTech contact message sent through Resend."
        )

        print(
            "RESEND RESPONSE:",
            response
        )


        return jsonify({
            "success": True,
            "message": "Message sent successfully."
        }), 200


    # -----------------------------------------------------
    # RESEND ERROR
    # -----------------------------------------------------

    except Exception as error:

        print(
            "EMAIL ERROR: Resend request failed."
        )

        print(
            "ERROR:",
            error
        )

        return jsonify({
            "error": (
                "Unable to send your message right now."
            )
        }), 500


# =========================================================
# 404
# =========================================================

@app.errorhandler(404)
def page_not_found(error):

    return render_template(
        "404.html"
    ), 404


# =========================================================
# SERVER
# =========================================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",

        port=int(
            os.environ.get(
                "PORT",
                5000
            )
        ),

        debug=True
    )