import os
import time
import threading
from datetime import datetime

import resend
from flask import Flask, jsonify, render_template, request, abort, send_from_directory


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
# INSIGHTS / BLOG CONTENT
# =========================================================
# To add a new post:
#   1. Copy an existing entry below
#   2. Give it a new slug (lowercase-with-dashes)
#   3. Fill in title, date (YYYY-MM-DD), tag, excerpt, body
#   4. It appears on /insights automatically, newest first
# =========================================================

POSTS = {

    "5-signs-your-website-is-costing-you-customers": {
        "title": "5 signs your website is costing you customers",
        "date": "2026-01-15",
        "tag": "Websites",
        "excerpt": "If any of these feel familiar, your site is quietly losing you money every day.",
        "body": [
            {"type": "p", "text": "A bad website doesn't announce itself. It just quietly turns people away. And most owners never see it happen — they only notice that inquiries are slower than they should be."},
            {"type": "p", "text": "Here are five warning signs. If you recognize one, it's worth fixing. If you recognize three or more, you're losing customers right now."},

            {"type": "h2", "text": "1. It takes more than 3 seconds to load"},
            {"type": "p", "text": "Every extra second of load time cuts conversions by roughly 7%. A site that takes five seconds is already costing you a third of your visitors — before they even see your content."},
            {"type": "p", "text": "Test yours with PageSpeed Insights. Anything below 70 on mobile is a problem."},

            {"type": "h2", "text": "2. It's painful on a phone"},
            {"type": "p", "text": "Most of your traffic is mobile. If someone has to pinch and zoom, or tap the wrong button because it's too small, they leave. Google also ranks mobile-unfriendly sites lower — so you lose twice."},

            {"type": "h2", "text": "3. It hasn't been updated in over a year"},
            {"type": "p", "text": "Outdated dates, broken images, dead links, old prices — they all signal one thing to a visitor: 'this business might not be active anymore.'"},
            {"type": "p", "text": "Even a small quarterly refresh (new photo, updated hours, freshest testimonial) keeps the signal alive."},

            {"type": "h2", "text": "4. There's no clear next step"},
            {"type": "p", "text": "Every page should answer one question: what do you want the visitor to do next? Call? Book? Buy? Sign up?"},
            {"type": "p", "text": "If the answer isn't obvious within 5 seconds of landing, you've lost them."},

            {"type": "h2", "text": "5. You can't update it yourself"},
            {"type": "p", "text": "If every text change means emailing your developer and waiting a week, you'll stop updating it. And a site that never changes stops feeling alive."},
            {"type": "p", "text": "A good CMS is not a luxury — it's how you keep the site current without friction."},

            {"type": "h2", "text": "What to do about it"},
            {"type": "p", "text": "You don't need a total rebuild to fix most of these. A focused redesign can solve speed, mobile, and CMS in weeks — not months."},
            {"type": "p", "text": "If you want to know which of these your site currently fails, we offer a free quick review. Just reach out."},
        ],
    },

    "how-much-should-a-website-cost-in-2026": {
        "title": "How much should a website actually cost in 2026?",
        "date": "2026-01-08",
        "tag": "Pricing",
        "excerpt": "The honest answer nobody wants to give: it depends. Here's what it depends on.",
        "body": [
            {"type": "p", "text": "Search 'how much does a website cost' and you'll get answers from $200 to $50,000. All of them are technically correct — and all of them are useless without context."},
            {"type": "p", "text": "Here's a real answer, structured the way an actual quote is structured."},

            {"type": "h2", "text": "What you're actually paying for"},
            {"type": "p", "text": "A website's price breaks down into five things. Every quote you'll ever get is some combination of these:"},
            {"type": "list", "items": [
                "Design — custom or templated",
                "Build — hand-coded or assembled from plugins",
                "Content — written by you, or written for you",
                "Functionality — a simple form, or a full login system",
                "Ongoing — nothing, or a monthly support retainer",
            ]},

            {"type": "h2", "text": "Typical price ranges (UK/US, 2026)"},
            {"type": "list", "items": [
                "Single-page site (custom design): $400 – $900",
                "Multi-page business site (5–10 pages): $900 – $3,500",
                "E-commerce (small catalogue): $2,000 – $6,000",
                "Custom web app (simple tool or dashboard): $3,000 – $15,000+",
                "Enterprise / complex systems: $15,000 and up",
            ]},
            {"type": "p", "text": "Below these numbers, you're usually getting templates, DIY platforms, or a hobbyist. Above them, you're paying for a bigger team, more process, or more scope."},

            {"type": "h2", "text": "Red flags in a cheap quote"},
            {"type": "list", "items": [
                "No written scope of work",
                "No timeline",
                "No mention of what happens after launch",
                "'Unlimited changes' with no cap",
                "Payment only in cash or personal transfer",
            ]},
            {"type": "p", "text": "If a quote hits two or more of these, walk away — the cheap price will cost you more later."},

            {"type": "h2", "text": "Red flags in an expensive quote"},
            {"type": "list", "items": [
                "Hourly billing with no cap",
                "Vague deliverables ('a modern website')",
                "You don't own the code or the domain",
                "Months-long timelines for a simple site",
            ]},

            {"type": "h2", "text": "What we actually charge"},
            {"type": "p", "text": "Our websites start at $500. Our web apps start at $2,000. Every project gets a fixed quote before we begin — you'll never see an hourly invoice from us."},
            {"type": "p", "text": "If you want a specific number for your project, the fastest way is to tell us what you're building. We'll reply within a business day."},
        ],
    },

}
# =========================================================


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


@app.route("/services")
def services():
    return render_template("services.html")


@app.route("/work")
def work():
    return render_template("work.html")


@app.route("/contact")
def contact():
    return render_template("contact.html")


@app.route("/start")
def start():
    return render_template("start.html")


@app.route("/insights")
def insights():
    posts = sorted(
        (
            {**post, "slug": slug}
            for slug, post in POSTS.items()
        ),
        key=lambda p: p["date"],
        reverse=True
    )
    return render_template("insights.html", posts=posts)


@app.route("/insights/<slug>")
def insight_post(slug):
    post = POSTS.get(slug)
    if not post:
        abort(404)
    return render_template("post.html", post=post, slug=slug)


# =========================================================
# SEO ROUTES (robots.txt & sitemap.xml)
# =========================================================

@app.route('/robots.txt')
@app.route('/sitemap.xml')
def static_from_root():
    return send_from_directory(app.static_folder, request.path[1:])


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
# 404
# =========================================================

@app.errorhandler(404)
def not_found(error):
    return render_template("404.html"), 404


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