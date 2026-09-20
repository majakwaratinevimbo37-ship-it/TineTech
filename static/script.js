<script>
(() => {
    "use strict";

    if (window.TineTechV17) return;
    window.TineTechV17 = true;

    const root = document.querySelector(".tt16-home");
    if (!root) return;

    const nav = document.getElementById("tt16Nav");
    const menu = document.getElementById("tt16Menu");
    const navigation = document.getElementById("tt16Navigation");

    const hero = root.querySelector(".tt16-hero");
    const heroImage = root.querySelector(".tt16-visual-image img");
    const heroContent = root.querySelector(".tt16-hero-content");
    const heroVisual = root.querySelector(".tt16-hero-visual");

    const sections = [
        ...root.querySelectorAll(
            "main > section"
        )
    ];

    let currentScroll = window.scrollY;
    let targetScroll = window.scrollY;

    let lastScroll = window.scrollY;
    let scrollVelocity = 0;

    let mouseX = 0.5;
    let mouseY = 0.5;

    let smoothMouseX = 0.5;
    let smoothMouseY = 0.5;

    let ticking = false;


    /* =========================================================
       CINEMATIC STYLE LAYER
       ========================================================= */

    const style = document.createElement("style");

    style.textContent = `

        /* =====================================================
           V17 CINEMATIC BASE
        ===================================================== */

        .tt16-home {
            --tt16-scroll-progress: 0;
            --tt16-scroll-velocity: 0;
            --tt16-mouse-x: .5;
            --tt16-mouse-y: .5;
        }


        /* =====================================================
           HERO DEPTH
        ===================================================== */

        .tt16-hero {
            perspective: 1400px;
            transform-style: preserve-3d;
        }

        .tt16-hero-grid,
        .tt16-hero-glow-one,
        .tt16-hero-glow-two {
            transition:
                transform 1.2s cubic-bezier(.16,1,.3,1);
            will-change: transform;
        }

        .tt16-hero-content {
            will-change: transform, opacity;
        }

        .tt16-hero-visual {
            transform-style: preserve-3d;
            will-change: transform;
        }

        .tt16-visual-image {
            transform-style: preserve-3d;
            overflow: hidden;
        }

        .tt16-visual-image img {
            will-change: transform;
            transition:
                transform 1.2s cubic-bezier(.16,1,.3,1);
        }


        /* =====================================================
           CINEMATIC SECTION DEPTH
        ===================================================== */

        .tt16-cinematic-section {
            position: relative;
            transform-style: preserve-3d;
            will-change: transform, opacity;
        }

        .tt16-cinematic-section::after {
            content: "";
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 20;

            background:
                radial-gradient(
                    circle at
                    calc(var(--tt16-mouse-x) * 100%)
                    calc(var(--tt16-mouse-y) * 100%),
                    rgba(49,92,255,.08),
                    transparent 32%
                );

            opacity: .8;
        }


        /* =====================================================
           SERVICE CARDS — 3D
        ===================================================== */

        .tt16-service-card {
            position: relative;
            transform-style: preserve-3d;

            will-change:
                transform,
                box-shadow;

            transition:
                transform .15s ease-out,
                box-shadow .4s ease,
                filter .4s ease;
        }

        .tt16-service-card::before {
            content: "";

            position: absolute;
            inset: 0;

            pointer-events: none;

            border-radius: inherit;

            background:
                radial-gradient(
                    circle at
                    calc(var(--card-x, 50) * 1%)
                    calc(var(--card-y, 50) * 1%),
                    rgba(255,255,255,.18),
                    transparent 30%
                );

            opacity: 0;

            transition: opacity .35s ease;
        }

        .tt16-service-card:hover::before {
            opacity: 1;
        }

        .tt16-service-card > * {
            transform: translateZ(25px);
        }


        /* =====================================================
           PROCESS CINEMATIC STATE
        ===================================================== */

        .tt16-process-item {
            position: relative;
            overflow: hidden;

            transition:
                padding .45s cubic-bezier(.16,1,.3,1),
                background .45s ease,
                transform .45s ease;
        }

        .tt16-process-item::before {
            content: "";

            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;

            width: 3px;

            background: #315cff;

            transform:
                scaleY(0);

            transform-origin: center;

            transition:
                transform .5s cubic-bezier(.16,1,.3,1);
        }

        .tt16-process-item.tt16-process-active::before {
            transform: scaleY(1);
        }


        /* =====================================================
           IMAGE DEPTH
        ===================================================== */

        .tt16-large-image {
            overflow: hidden;
            transform-style: preserve-3d;
        }

        .tt16-large-image img {
            will-change: transform;
            transition:
                transform 1.2s cubic-bezier(.16,1,.3,1);
        }


        /* =====================================================
           TECHNOLOGY GRID
        ===================================================== */

        .tt16-tech-grid > div {
            position: relative;
            overflow: hidden;

            transform-style: preserve-3d;

            transition:
                transform .4s cubic-bezier(.16,1,.3,1),
                background .4s ease;
        }

        .tt16-tech-grid > div:hover {
            transform:
                translateY(-8px)
                translateZ(20px);
        }


        /* =====================================================
           CINEMATIC ACTIVE SECTION
        ===================================================== */

        .tt16-scene-active {
            filter: brightness(1);
        }


        /* =====================================================
           SCROLL VELOCITY LIGHT
        ===================================================== */

        .tt16-home::before {
            content: "";

            position: fixed;
            inset: 0;

            z-index: 9990;

            pointer-events: none;

            background:
                linear-gradient(
                    to bottom,
                    rgba(49,92,255,.04),
                    transparent 20%,
                    transparent 80%,
                    rgba(49,92,255,.04)
                );

            opacity:
                calc(
                    min(
                        var(--tt16-scroll-velocity) * .8,
                        .12
                    )
                );

            transition: opacity .2s ease;
        }


        /* =====================================================
           SCROLL INDICATOR
        ===================================================== */

        .tt16-scroll-indicator {
            transition:
                opacity .5s ease,
                transform .6s cubic-bezier(.16,1,.3,1);
        }

        .tt16-scroll-indicator.tt16-scroll-hidden {
            opacity: 0;
            transform: translateY(20px);
        }


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

            .tt16-service-card,
            .tt16-hero-visual,
            .tt16-large-image img {
                transition: none !important;
            }

        }

    `;

    document.head.appendChild(style);


    /* =========================================================
       NAVIGATION
       ========================================================= */

    function updateNav() {

        if (!nav) return;

        nav.classList.toggle(
            "tt16-scrolled",
            window.scrollY > 40
        );
    }


    /* =========================================================
       MOBILE MENU
       ========================================================= */

    function initialiseMenu() {

        if (!menu || !navigation) return;

        menu.addEventListener("click", () => {

            navigation.classList.toggle(
                "tt16-open"
            );

            menu.classList.toggle(
                "tt16-open"
            );

        });


        navigation
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => {

                        navigation.classList.remove(
                            "tt16-open"
                        );

                        menu.classList.remove(
                            "tt16-open"
                        );

                    }
                );

            });
    }


    /* =========================================================
       MOUSE ENVIRONMENT
       ========================================================= */

    function initialiseMouse() {

        if (
            !window.matchMedia(
                "(pointer:fine)"
            ).matches
        ) return;

        window.addEventListener(
            "mousemove",
            event => {

                mouseX =
                    event.clientX /
                    window.innerWidth;

                mouseY =
                    event.clientY /
                    window.innerHeight;

            },
            { passive: true }
        );
    }


    /* =========================================================
       HERO PARALLAX
       ========================================================= */

    function updateHero(progress) {

        if (!hero) return;

        const heroRect =
            hero.getBoundingClientRect();

        const heroHeight =
            hero.offsetHeight;

        const heroProgress =
            Math.min(
                1,
                Math.max(
                    0,
                    -heroRect.top /
                    heroHeight
                )
            );


        if (heroContent) {

            const y =
                heroProgress * -90;

            const scale =
                1 -
                heroProgress * .08;

            const opacity =
                1 -
                heroProgress * .75;

            heroContent.style.transform =
                `translate3d(
                    0,
                    ${y}px,
                    0
                ) scale(${scale})`;

            heroContent.style.opacity =
                opacity;
        }


        if (heroVisual) {

            const y =
                heroProgress * 90;

            const scale =
                1 -
                heroProgress * .035;

            heroVisual.style.transform =
                `translate3d(
                    0,
                    ${y}px,
                    0
                ) scale(${scale})`;
        }


        if (heroImage) {

            const x =
                (smoothMouseX - .5) * 20;

            const y =
                (smoothMouseY - .5) * 20;

            heroImage.style.transform =
                `scale(1.055)
                 translate3d(
                    ${x}px,
                    ${y + heroProgress * -35}px,
                    0
                 )`;
        }


        const grid =
            root.querySelector(
                ".tt16-hero-grid"
            );

        if (grid) {

            grid.style.transform =
                `translate3d(
                    ${(smoothMouseX - .5) * -20}px,
                    ${heroProgress * 80}px,
                    0
                )`;
        }


        const glowOne =
            root.querySelector(
                ".tt16-glow-one"
            );

        const glowTwo =
            root.querySelector(
                ".tt16-glow-two"
            );

        if (glowOne) {

            glowOne.style.transform =
                `translate3d(
                    ${(smoothMouseX - .5) * 60}px,
                    ${heroProgress * 100}px,
                    0
                )`;
        }

        if (glowTwo) {

            glowTwo.style.transform =
                `translate3d(
                    ${(smoothMouseX - .5) * -45}px,
                    ${heroProgress * -80}px,
                    0
                )`;
        }
    }


    /* =========================================================
       SECTION CINEMATIC DEPTH
       ========================================================= */

    function updateSections() {

        sections.forEach(section => {

            const rect =
                section.getBoundingClientRect();

            const viewport =
                window.innerHeight;

            const center =
                rect.top +
                rect.height / 2;

            const distance =
                (center - viewport / 2) /
                viewport;

            const clamped =
                Math.max(
                    -1,
                    Math.min(
                        1,
                        distance
                    )
                );

            const movement =
                clamped * -18;

            const opacity =
                Math.max(
                    .72,
                    1 -
                    Math.abs(clamped) * .28
                );

            section.style.setProperty(
                "--tt16-depth",
                `${movement}px`
            );

            section.style.setProperty(
                "--tt16-section-opacity",
                opacity
            );

            section.classList.add(
                "tt16-cinematic-section"
            );

            section.style.transform =
                `translate3d(
                    0,
                    ${movement}px,
                    0
                )`;

            section.style.opacity =
                opacity;


            const active =
                Math.abs(distance) < .38;

            section.classList.toggle(
                "tt16-scene-active",
                active
            );
        });
    }


    /* =========================================================
       LARGE IMAGE PARALLAX
       ========================================================= */

    function updateLargeImage() {

        const image =
            root.querySelector(
                ".tt16-large-image img"
            );

        if (!image) return;

        const container =
            image.closest(
                ".tt16-large-image"
            );

        if (!container) return;

        const rect =
            container.getBoundingClientRect();

        const viewport =
            window.innerHeight;

        const progress =
            (
                viewport - rect.top
            ) /
            (
                viewport +
                rect.height
            );

        const movement =
            (
                progress - .5
            ) * -70;

        image.style.transform =
            `scale(1.08)
             translate3d(
                0,
                ${movement}px,
                0
             )`;
    }


    /* =========================================================
       SERVICE CARD 3D
       ========================================================= */

    function initialiseServiceCards() {

        const cards =
            root.querySelectorAll(
                ".tt16-service-card"
            );

        cards.forEach(card => {

            card.addEventListener(
                "mousemove",
                event => {

                    if (
                        !window.matchMedia(
                            "(pointer:fine)"
                        ).matches
                    ) return;

                    const rect =
                        card.getBoundingClientRect();

                    const x =
                        (
                            event.clientX -
                            rect.left
                        ) /
                        rect.width;

                    const y =
                        (
                            event.clientY -
                            rect.top
                        ) /
                        rect.height;

                    const rotateX =
                        (y - .5) * -7;

                    const rotateY =
                        (x - .5) * 9;

                    card.style.setProperty(
                        "--card-x",
                        x * 100
                    );

                    card.style.setProperty(
                        "--card-y",
                        y * 100
                    );

                    card.style.transform =
                        `perspective(900px)
                         rotateX(${rotateX}deg)
                         rotateY(${rotateY}deg)
                         translateY(-8px)
                         scale(1.015)`;
                }
            );


            card.addEventListener(
                "mouseleave",
                () => {

                    card.style.transform =
                        "";
                }
            );
        });
    }


    /* =========================================================
       PROCESS ACTIVE STATE
       ========================================================= */

    function initialiseProcess() {

        const items =
            root.querySelectorAll(
                ".tt16-process-item"
            );

        if (!items.length) return;

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            entry.target.classList.toggle(
                                "tt16-process-active",
                                entry.isIntersecting
                            );

                        }
                    );

                },
                {
                    threshold: .65
                }
            );

        items.forEach(item =>
            observer.observe(item)
        );
    }


    /* =========================================================
       REVEAL ENGINE
       ========================================================= */

    function initialiseReveal() {

        const elements =
            root.querySelectorAll(
                ".tt16-service-card, " +
                ".tt16-process-item, " +
                ".tt16-large-image, " +
                ".tt16-stats > div, " +
                ".tt16-tech-grid > div"
            );

        if (
            !("IntersectionObserver" in window)
        ) {

            elements.forEach(
                element =>
                    element.classList.add(
                        "tt16-visible"
                    )
            );

            return;
        }


        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "tt16-visible"
                                );

                                observer.unobserve(
                                    entry.target
                                );
                            }

                        }
                    );

                },
                {
                    threshold: .12
                }
            );


        elements.forEach(element =>
            observer.observe(element)
        );
    }


    /* =========================================================
       SCROLL PROGRESS
       ========================================================= */

    function updateScroll() {

        targetScroll =
            window.scrollY;

        const max =
            document.documentElement
                .scrollHeight -
            window.innerHeight;

        const progress =
            max > 0
                ? targetScroll / max
                : 0;

        root.style.setProperty(
            "--tt16-scroll-progress",
            progress
        );


        scrollVelocity =
            Math.abs(
                targetScroll -
                lastScroll
            );

        scrollVelocity =
            Math.min(
                1,
                scrollVelocity / 45
            );

        root.style.setProperty(
            "--tt16-scroll-velocity",
            scrollVelocity
        );

        lastScroll =
            targetScroll;


        const indicator =
            root.querySelector(
                ".tt16-scroll-indicator"
            );

        if (indicator) {

            indicator.classList.toggle(
                "tt16-scroll-hidden",
                targetScroll > 80
            );
        }

        updateNav();

        ticking = false;
    }


    /* =========================================================
       ANIMATION LOOP
       ========================================================= */

    function animationLoop() {

        currentScroll +=
            (
                targetScroll -
                currentScroll
            ) * .09;


        smoothMouseX +=
            (
                mouseX -
                smoothMouseX
            ) * .08;

        smoothMouseY +=
            (
                mouseY -
                smoothMouseY
            ) * .08;


        root.style.setProperty(
            "--tt16-mouse-x",
            smoothMouseX
        );

        root.style.setProperty(
            "--tt16-mouse-y",
            smoothMouseY
        );


        updateHero(
            currentScroll /
            Math.max(
                1,
                hero
                    ? hero.offsetHeight
                    : 1
            )
        );

        updateSections();
        updateLargeImage();


        requestAnimationFrame(
            animationLoop
        );
    }


    /* =========================================================
       SCROLL LISTENER
       ========================================================= */

    window.addEventListener(
        "scroll",
        () => {

            if (!ticking) {

                requestAnimationFrame(
                    updateScroll
                );

                ticking = true;
            }

        },
        {
            passive: true
        }
    );


    /* =========================================================
       SMOOTH INTERNAL LINKS
       ========================================================= */

    function initialiseSmoothLinks() {

        root.querySelectorAll(
            'a[href^="#"]'
        ).forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const id =
                        link
                            .getAttribute("href")
                            .slice(1);

                    const target =
                        document.getElementById(
                            id
                        );

                    if (!target) return;

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });
    }


    /* =========================================================
       KEYBOARD NAVIGATION
       ========================================================= */

    function initialiseKeyboard() {

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !== "ArrowDown" &&
                    event.key !== "ArrowUp"
                ) return;

                const visible =
                    sections
                        .map((section, index) => ({
                            section,
                            index,
                            distance:
                                Math.abs(
                                    section.getBoundingClientRect()
                                        .top
                                )
                        }))
                        .sort(
                            (a, b) =>
                                a.distance -
                                b.distance
                        )[0];

                if (!visible) return;

                let nextIndex =
                    visible.index;

                if (
                    event.key ===
                    "ArrowDown"
                ) {
                    nextIndex++;
                } else {
                    nextIndex--;
                }

                nextIndex =
                    Math.max(
                        0,
                        Math.min(
                            sections.length - 1,
                            nextIndex
                        )
                    );

                sections[nextIndex]
                    .scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
            }
        );
    }


    /* =========================================================
       INITIALIZE
       ========================================================= */

    function boot() {

        initialiseMenu();
        initialiseMouse();
        initialiseServiceCards();
        initialiseProcess();
        initialiseReveal();
        initialiseSmoothLinks();
        initialiseKeyboard();

        updateNav();
        updateScroll();

        animationLoop();

        console.log(
            "%c T!NΞ V17 CINEMATIC ENGINE ONLINE ",
            "background:#080a0f;color:#315cff;padding:10px;font-weight:800;"
        );
    }


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
</script>