/* =========================================================
   TINETECH — MASTER INTERACTION ENGINE
   V13
   ========================================================= */

(() => {
    "use strict";

    if (window.TineTechV13) return;
    window.TineTechV13 = true;

    const body = document.body;

    /* =====================================================
       PAGE IDENTITY
    ===================================================== */

    const page =
        body.classList.contains("v5-home") ? "HOME" :
        body.classList.contains("v5-lab-page") ? "LAB" :
        body.classList.contains("v5-about-page") ? "ABOUT" :
        body.classList.contains("v5-system-page") ? "SYSTEM" :
        body.classList.contains("v5-contact-page") ? "CONTACT" :
        "TINETECH";

    const PAGE_DATA = {
        HOME: {
            online: "SYSTEM ONLINE",
            states: [
                ["ORIGIN", "THE TINETECH ENVIRONMENT IS ONLINE."],
                ["DISCOVERY", "EXPLORING THE DIGITAL ENVIRONMENT."],
                ["CORE", "CORE SYSTEMS ARE ACTIVE."],
                ["FUTURE", "NEXT STATE APPROACHING."],
                ["CONNECTION", "READY FOR CONNECTION."]
            ]
        },

        LAB: {
            online: "LAB ONLINE",
            states: [
                ["EXPERIMENT", "EXPERIMENTAL ENVIRONMENT INITIALIZED."],
                ["PROJECTS", "PROJECT MATRIX ONLINE."],
                ["PROCESS", "EXPERIMENT LOOP ACTIVE."],
                ["INTERFACE", "SYSTEM INTERFACE ONLINE."],
                ["NEXT EXPERIMENT", "LAB READY FOR THE NEXT CREATION."]
            ]
        },

        ABOUT: {
            online: "IDENTITY ONLINE",
            states: [
                ["ORIGIN", "SCANNING THE TINETECH ORIGIN."],
                ["VISION", "VISION PROFILE ACTIVE."],
                ["PHILOSOPHY", "SYSTEM PHILOSOPHY LOADED."],
                ["MINDSET", "THINKING SYSTEM ONLINE."],
                ["EVOLUTION", "EVOLUTION PROTOCOL ACTIVE."]
            ]
        },

        SYSTEM: {
            online: "SYSTEM ONLINE",
            states: [
                ["CORE", "CORE SYSTEMS ONLINE."],
                ["CODE", "CODE ENVIRONMENT INITIALIZED."],
                ["INTELLIGENCE", "INTELLIGENCE MODULE ACTIVE."],
                ["INTERFACE", "INTERFACE SYSTEM ACTIVE."],
                ["EVOLUTION", "SYSTEM EVOLUTION READY."]
            ]
        },

        CONTACT: {
            online: "CHANNEL ONLINE",
            states: [
                ["CHANNEL", "COMMUNICATION CHANNEL READY."],
                ["SIGNAL", "SIGNAL ACQUIRED."],
                ["MESSAGE", "MESSAGE SYSTEM READY."],
                ["TRANSMIT", "TRANSMISSION PROTOCOL READY."],
                ["CONNECTION", "CONNECTION ESTABLISHED."]
            ]
        }
    };

    const DATA = PAGE_DATA[page] || PAGE_DATA.HOME;


    /* =====================================================
       RUNTIME VISUAL SYSTEM
       Scoped — does NOT replace master CSS.
    ===================================================== */

    const style = document.createElement("style");

    style.textContent = `

        /* =================================================
           TINETECH V13 VISUAL ENGINE
        ================================================= */

        .tt13-layer {
            position: fixed;
            inset: 0;
            z-index: 99990;
            pointer-events: none;
            opacity: 0;
            background:
                radial-gradient(
                    circle at var(--tt13-x, 50%) var(--tt13-y, 50%),
                    rgba(57,191,255,.18),
                    transparent 30%
                );
            transition: opacity .35s ease;
        }

        .tt13-layer.active {
            opacity: 1;
        }


        /* =================================================
           STATE PANEL
        ================================================= */

        .tt13-panel {
            position: fixed;
            left: 50%;
            top: 50%;
            width: min(520px, 86vw);
            z-index: 99999;

            padding: 30px;

            transform:
                translate(-50%, -50%)
                scale(.86);

            opacity: 0;
            pointer-events: none;

            background:
                linear-gradient(
                    145deg,
                    rgba(5,8,15,.96),
                    rgba(1,2,5,.92)
                );

            border:
                1px solid
                rgba(57,191,255,.35);

            box-shadow:
                0 0 80px
                rgba(57,191,255,.16),
                inset 0 0 40px
                rgba(57,191,255,.035);

            backdrop-filter: blur(20px);

            transition:
                opacity .28s ease,
                transform .42s cubic-bezier(.16,1,.3,1);
        }

        .tt13-panel.active {
            opacity: 1;
            transform:
                translate(-50%, -50%)
                scale(1);
        }

        .tt13-panel::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background:
                linear-gradient(
                    90deg,
                    transparent,
                    #39bfff,
                    transparent
                );
        }

        .tt13-page {
            color: #39bfff;
            font-size: 9px;
            letter-spacing: .3em;
            margin-bottom: 12px;
        }

        .tt13-title {
            color: white;
            font-size: clamp(30px, 6vw, 62px);
            font-weight: 800;
            line-height: .9;
            letter-spacing: -.045em;
        }

        .tt13-description {
            color: rgba(255,255,255,.58);
            margin-top: 18px;
            font-size: 12px;
            line-height: 1.7;
            letter-spacing: .08em;
        }

        .tt13-number {
            margin-top: 24px;
            color: rgba(57,191,255,.55);
            font-size: 9px;
            letter-spacing: .25em;
        }


        /* =================================================
           CLICK RIPPLE
        ================================================= */

        .tt13-ripple {
            position: absolute;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            pointer-events: none;

            background:
                rgba(57,191,255,.45);

            transform:
                translate(-50%, -50%)
                scale(0);

            animation:
                tt13Ripple .75s ease-out forwards;
        }

        @keyframes tt13Ripple {
            0% {
                opacity: .8;
                transform:
                    translate(-50%, -50%)
                    scale(0);
            }

            100% {
                opacity: 0;
                transform:
                    translate(-50%, -50%)
                    scale(18);
            }
        }


        /* =================================================
           UNIVERSAL INTERACTIVE ELEMENT
        ================================================= */

        .tt13-interactive {
            cursor: pointer;
            transition:
                transform .35s cubic-bezier(.16,1,.3,1),
                filter .35s ease,
                box-shadow .35s ease;
        }

        .tt13-interactive:hover {
            filter:
                brightness(1.16)
                drop-shadow(
                    0 0 18px
                    rgba(57,191,255,.12)
                );
        }

        .tt13-interactive.tt13-active {
            filter:
                brightness(1.3)
                drop-shadow(
                    0 0 28px
                    rgba(57,191,255,.22)
                );
        }


        /* =================================================
           LAB LOOP
        ================================================= */

        .v5-lab-loop .loop-node {
            cursor: pointer;
            transition:
                transform .4s cubic-bezier(.16,1,.3,1),
                filter .3s ease,
                box-shadow .3s ease,
                border-color .3s ease;
        }

        .v5-lab-loop .loop-node:hover {
            transform: scale(1.08);
            filter:
                brightness(1.25)
                drop-shadow(
                    0 0 20px
                    rgba(57,191,255,.25)
                );
        }

        .v5-lab-loop .loop-node.tt13-selected {
            transform: scale(1.15);
            filter:
                brightness(1.45)
                drop-shadow(
                    0 0 35px
                    rgba(57,191,255,.4)
                );
        }

        .v5-lab-loop .loop-node.tt13-selected::after {
            content: "";
            position: absolute;
            inset: -10px;
            border:
                1px solid
                rgba(57,191,255,.35);
            border-radius: inherit;
            animation:
                tt13Pulse 1.4s ease-out infinite;
        }

        @keyframes tt13Pulse {
            0% {
                opacity: .8;
                transform: scale(.85);
            }

            100% {
                opacity: 0;
                transform: scale(1.4);
            }
        }


        /* =================================================
           PROJECT CARDS
        ================================================= */

        .v5-project-card {
            cursor: pointer;
            transition:
                transform .45s cubic-bezier(.16,1,.3,1),
                border-color .3s ease,
                box-shadow .3s ease,
                filter .3s ease;
        }

        .v5-project-card:hover {
            transform:
                translateY(-8px)
                scale(1.015);
            filter: brightness(1.12);
        }

        .v5-project-card.tt13-selected {
            transform:
                translateY(-10px)
                scale(1.025);

            border-color:
                rgba(57,191,255,.7);

            box-shadow:
                0 0 55px
                rgba(57,191,255,.16),
                inset 0 0 35px
                rgba(57,191,255,.035);
        }


        /* =================================================
           BUTTON ACTIVATION
        ================================================= */

        .v5-button.tt13-active {
            transform:
                translateY(-4px)
                scale(1.025);

            filter:
                brightness(1.3)
                drop-shadow(
                    0 0 25px
                    rgba(57,191,255,.3)
                );
        }


        /* =================================================
           NAVIGATION
        ================================================= */

        .v5-nav-links a {
            transition:
                color .25s ease,
                text-shadow .25s ease,
                transform .25s ease;
        }

        .v5-nav-links a:hover {
            color: #39bfff !important;
            text-shadow:
                0 0 16px
                rgba(57,191,255,.45);
        }


        /* =================================================
           SYSTEM TERMINAL
        ================================================= */

        .tt13-terminal-active {
            animation:
                tt13Terminal .65s ease;
        }

        @keyframes tt13Terminal {

            0% {
                opacity: .4;
                transform: translateY(10px);
                filter: brightness(.6);
            }

            50% {
                filter: brightness(1.6);
            }

            100% {
                opacity: 1;
                transform: translateY(0);
                filter: brightness(1);
            }

        }


        /* =================================================
           SCROLL TRANSITION
        ================================================= */

        body.tt13-transitioning .v5-main {
            filter:
                brightness(.75)
                blur(1px);
        }


        /* =================================================
           MOBILE
        ================================================= */

        @media(max-width:700px) {

            .tt13-panel {
                width: 82vw;
                padding: 24px;
            }

            .v5-lab-loop .loop-node:hover {
                transform: scale(1.03);
            }

        }
    `;

    document.head.appendChild(style);


    /* =====================================================
       UI
    ===================================================== */

    const layer = document.createElement("div");
    layer.className = "tt13-layer";

    const panel = document.createElement("div");
    panel.className = "tt13-panel";

    document.body.appendChild(layer);
    document.body.appendChild(panel);


    let panelTimer = null;


    /* =====================================================
       SHOW STATE
    ===================================================== */

    function showState(title, description, number = "") {

        clearTimeout(panelTimer);

        panel.innerHTML = `
            <div class="tt13-page">
                T!NΞ / ${page}
            </div>

            <div class="tt13-title">
                ${title}
            </div>

            <div class="tt13-description">
                ${description}
            </div>

            ${
                number
                    ? `<div class="tt13-number">${number}</div>`
                    : ""
            }
        `;

        layer.classList.add("active");
        panel.classList.add("active");

        panelTimer = setTimeout(() => {

            layer.classList.remove("active");
            panel.classList.remove("active");

        }, 1700);
    }


    /* =====================================================
       RIPPLE
    ===================================================== */

    function createRipple(element, event) {

        if (!element) return;

        const rect =
            element.getBoundingClientRect();

        const x =
            event &&
            typeof event.clientX === "number"
                ? event.clientX - rect.left
                : rect.width / 2;

        const y =
            event &&
            typeof event.clientY === "number"
                ? event.clientY - rect.top
                : rect.height / 2;

        if (
            getComputedStyle(element).position ===
            "static"
        ) {
            element.style.position = "relative";
        }

        const ripple =
            document.createElement("span");

        ripple.className =
            "tt13-ripple";

        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        element.appendChild(ripple);

        setTimeout(
            () => ripple.remove(),
            800
        );
    }


    /* =====================================================
       HUD
    ===================================================== */

    function updateHUD(title, index = null) {

        const state =
            document.getElementById("v5-state");

        const stateNumber =
            document.getElementById(
                "v5-state-number"
            );

        if (state) {
            state.textContent = title;
        }

        if (
            stateNumber &&
            index !== null
        ) {
            stateNumber.textContent =
                `0${index + 1} / 05`;
        }
    }


    /* =====================================================
       LAB LOOP
    ===================================================== */

    function initialiseLab() {

        const nodes =
            document.querySelectorAll(
                ".v5-lab-loop .loop-node"
            );

        if (!nodes.length) return;

        const states = [

            {
                title: "IDEA",
                text:
                    "CONCEPT DETECTED — imagine the system before building it."
            },

            {
                title: "BUILD",
                text:
                    "CONSTRUCTION ACTIVE — turn the concept into something real."
            },

            {
                title: "TEST",
                text:
                    "DIAGNOSTIC MODE — challenge the system and discover what fails."
            },

            {
                title: "EVOLVE",
                text:
                    "EVOLUTION ACTIVE — improve the system and create its next version."
            }

        ];

        nodes.forEach((node, index) => {

            node.classList.add(
                "tt13-interactive"
            );

            node.setAttribute(
                "role",
                "button"
            );

            node.setAttribute(
                "tabindex",
                "0"
            );

            const activate = event => {

                nodes.forEach(item => {
                    item.classList.remove(
                        "tt13-selected"
                    );
                });

                node.classList.add(
                    "tt13-selected"
                );

                createRipple(
                    node,
                    event
                );

                const state =
                    states[index];

                updateHUD(
                    state.title,
                    index
                );

                showState(
                    state.title,
                    state.text,
                    `EXPERIMENT LOOP / 0${index + 1}`
                );

            };

            node.addEventListener(
                "click",
                activate
            );

            node.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        activate(event);
                    }

                }
            );

        });
    }


    /* =====================================================
       LAB PROJECTS
    ===================================================== */

    function initialiseProjects() {

        const cards =
            document.querySelectorAll(
                ".v5-project-card"
            );

        if (!cards.length) return;

        const projects = [

            {
                title: "PYTHON SYSTEM",
                text:
                    "CODE EXPERIMENT INITIALIZED — automation and experimental software.",
            },

            {
                title: "AI CORE",
                text:
                    "INTELLIGENCE MODULE INITIALIZED — exploring artificial intelligence.",
            },

            {
                title: "DIGITAL WORLD",
                text:
                    "ENVIRONMENT INITIALIZED — interfaces designed to feel alive."
            }

        ];

        cards.forEach((card, index) => {

            card.classList.add(
                "tt13-interactive"
            );

            card.addEventListener(
                "click",
                event => {

                    cards.forEach(item =>
                        item.classList.remove(
                            "tt13-selected"
                        )
                    );

                    card.classList.add(
                        "tt13-selected"
                    );

                    createRipple(
                        card,
                        event
                    );

                    const project =
                        projects[index] ||
                        projects[0];

                    showState(
                        project.title,
                        project.text,
                        `PROJECT / 0${index + 1}`
                    );

                }
            );

        });
    }


    /* =====================================================
       SCENE STATES
    ===================================================== */

    function initialiseScenes() {

        const scenes =
            document.querySelectorAll(
                ".v5-scene"
            );

        if (!scenes.length) return;

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting)
                            return;

                        const scene =
                            entry.target;

                        const title =
                            scene.dataset.state;

                        if (!title)
                            return;

                        const number =
                            scene.querySelector(
                                ".v5-scene-number"
                            );

                        const index =
                            number
                                ? parseInt(
                                    number.textContent
                                ) - 1
                                : null;

                        updateHUD(
                            title,
                            index
                        );

                    });

                },
                {
                    threshold: 0.55
                }
            );

        scenes.forEach(scene =>
            observer.observe(scene)
        );
    }


    /* =====================================================
       ALL BUTTONS / LINKS
    ===================================================== */

    function initialiseUniversalControls() {

        const elements =
            document.querySelectorAll(
                ".v5-button, " +
                ".v5-scroll-link, " +
                ".v5-floating-object, " +
                ".v5-process > div, " +
                ".v5-future-symbol, " +
                ".v5-final-core, " +
                ".v5-lab-final-core"
            );

        elements.forEach(element => {

            element.classList.add(
                "tt13-interactive"
            );

            element.addEventListener(
                "click",
                event => {

                    element.classList.add(
                        "tt13-active"
                    );

                    createRipple(
                        element,
                        event
                    );

                    setTimeout(() => {
                        element.classList.remove(
                            "tt13-active"
                        );
                    }, 450);

                    const text =
                        element.innerText
                            .replace(/\s+/g, " ")
                            .trim()
                            .slice(0, 30);

                    if (!text) return;

                    let title = "ACTIVE";
                    let description =
                        "TineTech interaction activated.";

                    if (
                        page === "HOME"
                    ) {

                        title = "EXPLORE";
                        description =
                            "HOME ENVIRONMENT ACTIVATED — explore the next state.";

                    }

                    if (
                        page === "ABOUT"
                    ) {

                        title = "IDENTITY";
                        description =
                            "ABOUT SYSTEM ACTIVATED — exploring the mind behind TineTech.";

                    }

                    if (
                        page === "SYSTEM"
                    ) {

                        title = "SYSTEM";
                        description =
                            "SYSTEM INTERFACE ACTIVATED — technology layer responding.";

                    }

                    if (
                        page === "CONTACT"
                    ) {

                        title = "CONNECTION";
                        description =
                            "COMMUNICATION CHANNEL ACTIVATED.";

                    }

                    if (
                        page === "LAB"
                    ) {

                        title = "EXPERIMENT";
                        description =
                            "LAB INTERACTION ACTIVATED.";

                    }

                    showState(
                        title,
                        description
                    );

                }
            );

        });
    }


    /* =====================================================
       NAVIGATION
    ===================================================== */

    function initialiseNavigation() {

        const links =
            document.querySelectorAll(
                ".v5-nav-links a"
            );

        links.forEach(link => {

            link.classList.add(
                "tt13-interactive"
            );

            link.addEventListener(
                "click",
                event => {

                    const href =
                        link.getAttribute("href");

                    if (!href)
                        return;

                    createRipple(
                        link,
                        event
                    );

                    const name =
                        link.textContent
                            .replace(/\s+/g, " ")
                            .trim();

                    showState(
                        name,
                        `NAVIGATING TO ${name}.`
                    );

                }
            );

        });
    }


    /* =====================================================
       MAGNETIC BUTTONS
    ===================================================== */

    function initialiseMagnetic() {

        const buttons =
            document.querySelectorAll(
                ".v5-magnetic"
            );

        buttons.forEach(button => {

            button.addEventListener(
                "mousemove",
                event => {

                    const rect =
                        button.getBoundingClientRect();

                    const x =
                        event.clientX -
                        rect.left -
                        rect.width / 2;

                    const y =
                        event.clientY -
                        rect.top -
                        rect.height / 2;

                    button.style.transform =
                        `translate(${x * .08}px, ${y * .08}px)`;

                }
            );

            button.addEventListener(
                "mouseleave",
                () => {

                    button.style.transform =
                        "";

                }
            );

        });
    }


    /* =====================================================
       CURSOR
    ===================================================== */

    function initialiseCursor() {

        const cursor =
            document.querySelector(
                ".v5-cursor"
            );

        if (!cursor)
            return;

        const dot =
            cursor.querySelector(
                ".v5-cursor-dot"
            );

        const ring =
            cursor.querySelector(
                ".v5-cursor-ring"
            );

        const label =
            cursor.querySelector(
                "span"
            );

        let mouseX = 0;
        let mouseY = 0;
        let ringX = 0;
        let ringY = 0;

        document.addEventListener(
            "mousemove",
            event => {

                mouseX =
                    event.clientX;

                mouseY =
                    event.clientY;

                if (dot) {

                    dot.style.left =
                        `${mouseX}px`;

                    dot.style.top =
                        `${mouseY}px`;

                }

                layer.style.setProperty(
                    "--tt13-x",
                    `${mouseX}px`
                );

                layer.style.setProperty(
                    "--tt13-y",
                    `${mouseY}px`
                );

            }
        );

        function animateCursor() {

            ringX +=
                (mouseX - ringX) * .16;

            ringY +=
                (mouseY - ringY) * .16;

            if (ring) {

                ring.style.left =
                    `${ringX}px`;

                ring.style.top =
                    `${ringY}px`;

            }

            requestAnimationFrame(
                animateCursor
            );
        }

        animateCursor();


        const interactive =
            document.querySelectorAll(
                "a, button, " +
                ".v5-project-card, " +
                ".loop-node, " +
                ".v5-button"
            );

        interactive.forEach(element => {

            element.addEventListener(
                "mouseenter",
                () => {

                    cursor.classList.add(
                        "active"
                    );

                    if (label)
                        label.textContent =
                            "SELECT";

                }
            );

            element.addEventListener(
                "mouseleave",
                () => {

                    cursor.classList.remove(
                        "active"
                    );

                    if (label)
                        label.textContent =
                            "MOVE";

                }
            );

        });
    }


    /* =====================================================
       MENU
    ===================================================== */

    function initialiseMenu() {

        const menu =
            document.getElementById(
                "v5-menu"
            );

        if (!menu)
            return;

        let open = false;

        menu.addEventListener(
            "click",
            event => {

                open = !open;

                menu.classList.toggle(
                    "active",
                    open
                );

                createRipple(
                    menu,
                    event
                );

                showState(
                    open
                        ? "MENU"
                        : "SYSTEM",
                    open
                        ? "NAVIGATION INTERFACE OPEN."
                        : "NAVIGATION INTERFACE CLOSED."
                );

            }
        );
    }


    /* =====================================================
       SCROLL PROGRESS
    ===================================================== */

    function initialiseProgress() {

        const bar =
            document.getElementById(
                "v5-progress-bar"
            );

        const text =
            document.getElementById(
                "v5-progress-text"
            );

        if (!bar && !text)
            return;

        function update() {

            const max =
                document.documentElement
                    .scrollHeight -
                window.innerHeight;

            const progress =
                max > 0
                    ? Math.min(
                        100,
                        Math.max(
                            0,
                            (window.scrollY / max) *
                            100
                        )
                    )
                    : 0;

            if (bar)
                bar.style.width =
                    `${progress}%`;

            if (text)
                text.textContent =
                    `${String(
                        Math.round(progress)
                    ).padStart(3, "0")}%`;

        }

        window.addEventListener(
            "scroll",
            update,
            { passive: true }
        );

        update();
    }


    /* =====================================================
       PARALLAX WORLD
    ===================================================== */

    function initialiseParallax() {

        const world =
            document.querySelector(
                ".v5-world"
            );

        if (!world)
            return;

        window.addEventListener(
            "mousemove",
            event => {

                const x =
                    (event.clientX /
                        window.innerWidth -
                        .5);

                const y =
                    (event.clientY /
                        window.innerHeight -
                        .5);

                world.style.transform =
                    `translate3d(
                        ${x * -8}px,
                        ${y * -5}px,
                        0
                    )`;

            },
            { passive: true }
        );
    }


    /* =====================================================
       KEYBOARD SHORTCUTS
    ===================================================== */

    function initialiseKeyboard() {

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape"
                ) {

                    panel.classList.remove(
                        "active"
                    );

                    layer.classList.remove(
                        "active"
                    );

                }

                /* LAB shortcuts */

                if (
                    page === "LAB"
                ) {

                    const keys = {
                        "1": 0,
                        "2": 1,
                        "3": 2,
                        "4": 3
                    };

                    if (
                        keys[event.key] !== undefined
                    ) {

                        const nodes =
                            document.querySelectorAll(
                                ".v5-lab-loop .loop-node"
                            );

                        const node =
                            nodes[
                                keys[event.key]
                            ];

                        if (node)
                            node.click();

                    }

                }

            }
        );
    }


    /* =====================================================
       TERMINAL
    ===================================================== */

    function initialiseTerminal() {

        const terminal =
            document.querySelector(
                ".v5-terminal"
            );

        if (!terminal)
            return;

        terminal.addEventListener(
            "click",
            event => {

                terminal.classList.remove(
                    "tt13-terminal-active"
                );

                void terminal.offsetWidth;

                terminal.classList.add(
                    "tt13-terminal-active"
                );

                createRipple(
                    terminal,
                    event
                );

                showState(
                    "TERMINAL",
                    "TERMINAL SYSTEM RESPONDING — INTERFACE ACTIVE."
                );

            }
        );

    }


    /* =====================================================
       PROCESS NODES
    ===================================================== */

    function initialiseProcess() {

        const nodes =
            document.querySelectorAll(
                ".v5-process > div"
            );

        nodes.forEach(
            (node, index) => {

                node.classList.add(
                    "tt13-interactive"
                );

                node.addEventListener(
                    "click",
                    event => {

                        const names = [
                            "IMAGINE",
                            "BUILD",
                            "EVOLVE"
                        ];

                        createRipple(
                            node,
                            event
                        );

                        showState(
                            names[index] ||
                                "PROCESS",
                            "T!NΞ PROCESS PROTOCOL ACTIVE."
                        );

                    }
                );

            }
        );
    }


    /* =====================================================
       INITIALIZATION
    ===================================================== */

    function boot() {

        initialiseLab();
        initialiseProjects();
        initialiseScenes();
        initialiseUniversalControls();
        initialiseNavigation();
        initialiseMagnetic();
        initialiseCursor();
        initialiseMenu();
        initialiseProgress();
        initialiseParallax();
        initialiseKeyboard();
        initialiseTerminal();
        initialiseProcess();

        console.log(
            `%c T!NΞ V13 ONLINE `,
            "background:#030303;color:#39bfff;padding:8px;font-weight:bold;"
        );

        console.log(
            `PAGE: ${page}`
        );

    }


    /* =====================================================
       START
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            boot
        );

    } else {

        boot();

    }

})();