import os
import smtplib
from email.message import EmailMessage

from flask import Flask, render_template, request, redirect, url_for


app = Flask(__name__)

OWNER_EMAIL = "majakwaratinevimbo37@gmail.com"


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


@app.post("/contact/send")
def send_contact():

    name = request.form.get("name", "").strip()
    sender_email = request.form.get("email", "").strip()
    subject = request.form.get("subject", "").strip()
    message = request.form.get("message", "").strip()

    if not name or not sender_email or not subject or not message:
        return redirect(url_for("contact", status="missing"))

    smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))
    smtp_username = os.environ.get("SMTP_USERNAME")
    smtp_password = os.environ.get("SMTP_PASSWORD")

    if not smtp_username or not smtp_password:
        print("EMAIL ERROR: SMTP_USERNAME or SMTP_PASSWORD is missing")
        return redirect(url_for("contact", status="config"))

    email = EmailMessage()

    email["From"] = smtp_username
    email["To"] = OWNER_EMAIL
    email["Reply-To"] = sender_email
    email["Subject"] = f"TineTech Contact — {subject}"

    email.set_content(
        f"""NEW TINETECH COMMUNICATION

Name: {name}
Email: {sender_email}
Subject: {subject}

Message:
{message}

--------------------------------
TineTech Communication System
"""
    )

    try:
        with smtplib.SMTP(
            smtp_host,
            smtp_port,
            timeout=30
        ) as server:

            server.ehlo()
            server.starttls()
            server.ehlo()

            server.login(
                smtp_username,
                smtp_password
            )

            server.send_message(email)

        print("EMAIL SUCCESS: Transmission delivered to SMTP server.")

        return redirect(
            url_for("contact", status="sent")
        )

    except smtplib.SMTPAuthenticationError as error:
        print("EMAIL ERROR: SMTP authentication failed.")
        print(error)

        return redirect(
            url_for("contact", status="auth")
        )

    except smtplib.SMTPException as error:
        print("EMAIL ERROR: SMTP failure.")
        print(error)

        return redirect(
            url_for("contact", status="smtp")
        )

    except Exception as error:
        print("EMAIL ERROR:", error)

        return redirect(
            url_for("contact", status="error")
        )


@app.errorhandler(404)
def page_not_found(error):
    return render_template("404.html"), 404


if __name__ == "__main__":
    app.run(debug=True)