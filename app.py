import os
import smtplib
from email.message import EmailMessage

from flask import Flask, render_template, request, jsonify


app = Flask(__name__)


# ============================================================
# PRIVATE EMAIL CONFIGURATION
# ============================================================

OWNER_EMAIL = os.environ.get(
    "OWNER_EMAIL",
    "majakwaratinevimbo37@gmail.com"
)

SMTP_HOST = os.environ.get(
    "SMTP_HOST",
    "smtp.gmail.com"
)

SMTP_PORT = int(
    os.environ.get(
        "SMTP_PORT",
        "587"
    )
)

SMTP_USERNAME = os.environ.get("SMTP_USERNAME")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD")


# ============================================================
# WEBSITE PAGES
# ============================================================

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


# ============================================================
# CONTACT API
# ============================================================

@app.route("/api/contact", methods=["POST"])
def api_contact():

    try:

        data = request.get_json(silent=True)

        if not data:
            return jsonify({
                "error": "Invalid request."
            }), 400


        # ----------------------------------------------------
        # GET FORM DATA
        # ----------------------------------------------------

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


        # ----------------------------------------------------
        # VALIDATION
        # ----------------------------------------------------

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


        # ----------------------------------------------------
        # EMAIL CONFIGURATION CHECK
        # ----------------------------------------------------

        if not SMTP_USERNAME or not SMTP_PASSWORD:

            print(
                "EMAIL ERROR: "
                "SMTP_USERNAME or SMTP_PASSWORD is missing."
            )

            return jsonify({
                "error": "Email system is not configured yet."
            }), 500


        # ----------------------------------------------------
        # CREATE EMAIL
        # ----------------------------------------------------

        email = EmailMessage()

        email["From"] = SMTP_USERNAME
        email["To"] = OWNER_EMAIL
        email["Reply-To"] = sender_email

        email["Subject"] = (
            f"TineTech Project Inquiry — {project}"
        )

        email.set_content(
            f"""
TINETECH PROJECT INQUIRY
========================

NAME
{name}

EMAIL
{sender_email}

PROJECT
{project}

MESSAGE
{message}

========================
Sent through the TineTech website.
"""
        )


        # ----------------------------------------------------
        # SEND EMAIL
        # ----------------------------------------------------

        with smtplib.SMTP(
            SMTP_HOST,
            SMTP_PORT,
            timeout=30
        ) as server:

            server.ehlo()

            server.starttls()

            server.ehlo()

            server.login(
                SMTP_USERNAME,
                SMTP_PASSWORD
            )

            server.send_message(email)


        print(
            "EMAIL SUCCESS: "
            "TineTech contact message sent."
        )


        # ----------------------------------------------------
        # SUCCESS RESPONSE
        # ----------------------------------------------------

        return jsonify({
            "success": True,
            "message": "Message sent successfully."
        }), 200


    # ========================================================
    # EMAIL ERRORS
    # ========================================================

    except smtplib.SMTPAuthenticationError:

        print(
            "EMAIL ERROR: "
            "SMTP authentication failed."
        )

        return jsonify({
            "error": "Email authentication failed."
        }), 500


    except smtplib.SMTPException as error:

        print(
            "EMAIL ERROR: SMTP failure."
        )

        print(error)

        return jsonify({
            "error": "Email server error. Please try again."
        }), 500


    except Exception as error:

        print(
            "EMAIL ERROR:"
        )

        print(error)

        return jsonify({
            "error": "Unable to send your message right now."
        }), 500


# ============================================================
# 404 PAGE
# ============================================================

@app.errorhandler(404)
def page_not_found(error):

    return render_template(
        "404.html"
    ), 404


# ============================================================
# RUN SERVER
# ============================================================

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