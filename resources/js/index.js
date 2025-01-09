import '../css/style.scss';

document.addEventListener('DOMContentLoaded', () => {
    // Fonction pour initialiser la navbar en fonction de l'URL
    const initNavbarForPortfolio = () => {
        const navbar = document.querySelector('.side-nav');
        const currentPath = window.location.pathname;
        // Mise à jour de la navbar si on est sur une page de portfolio
        if (currentPath !== '/') {
            navbar.innerHTML = `
                <ul>
                    <li><a href="/" class="home-link">Accueil</a></li>
                    <li><a href="/portfolio" class="portfolio-link active">Portfolio</a></li>
                </ul>
            `;
        }

        navbar.addEventListener('click', () => {
            navbar.classList.toggle('mobile'); // Ajouter/Retirer la classe "mobile"
        });
    };

    // Effet de défilement lisse et gestion des liens actifs
    const initSmoothScrollAndActiveLinks = () => {
        const links = document.querySelectorAll('.side-nav a');
        const activeIndicator = document.querySelector('.side-nav .active-indicator');

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
        
                // Retirer la classe 'active' des autres liens
                links.forEach(link => link.classList.remove('active'));
                link.classList.add('active');
        
                // Mettre à jour l'indicateur actif
                if (activeIndicator) {
                    activeIndicator.textContent = link.textContent;
                }
        
                // Vérifier si le lien est interne (vers une section)
                const targetSelector = link.getAttribute('href');
                if (targetSelector && targetSelector.startsWith('#')) {
                    const targetSection = document.querySelector(targetSelector);
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }
                } else {
                    // Si le lien est externe ou vers la racine, changer de page
                    window.location.href = targetSelector;
                }
            });
        });
        
    };

    // Suivi de la section visible
    const initActiveSectionOnScroll = () => {
        const sections = document.querySelectorAll('.section');
        const links = document.querySelectorAll('.side-nav a');

        if (sections.length > 0) {
            const activateSection = () => {
                let index = sections.length;
                while (--index && window.scrollY + 100 < sections[index].offsetTop) {}
                links.forEach(link => link.classList.remove('active'));
                if (links[index]) links[index].classList.add('active');
            };

            window.addEventListener('scroll', activateSection);
            activateSection();
        }
    };

    var maxDist;
    var mouse = { x: 0, y: 0 };
    var cursor = {
        x: window.innerWidth,
        y: window.innerHeight
    };
    
    // Calculer la distance entre deux points
    Math.dist = function (a, b) {
        var dx = b.x - a.x;
        var dy = b.y - a.y;
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    };
    
    // Suivi de la position du curseur
    window.addEventListener("mousemove", function (e) {
        cursor.x = e.clientX;
        cursor.y = e.clientY;
    });
    
    window.addEventListener("touchmove", function (e) {
        var t = e.touches[0];
        cursor.x = t.clientX;
        cursor.y = t.clientY;
    }, {
        passive: false
    });
    
    // Gestion des caractères animés
    var Char = function (container, char) {
        var span = document.createElement("span");
        span.setAttribute('data-char', char);
        span.innerText = char;
        container.appendChild(span);
    
        this.getDist = function () {
            this.pos = span.getBoundingClientRect();
            return Math.dist(mouse, {
                x: this.pos.x + (this.pos.width / 1.75),
                y: this.pos.y
            });
        };
    
        this.getAttr = function (dist, min, max) {
            var wght = max - Math.abs((max * dist / maxDist));
            return Math.max(min, wght + min);
        };
    
        this.update = function (args) {
            var dist = this.getDist();
            this.wdth = args.wdth ? ~~this.getAttr(dist, 12, 50) : 100;
            this.wght = args.wght ? ~~this.getAttr(dist, 300, 700) : 400;
            this.draw();
        };
    
        this.draw = function () {
            var style = "";
            style += "opacity: " + this.alpha + ";";
            style += "font-variation-settings: 'wght' " + this.wght + ", 'wdth' " + this.wdth +  ";";
            span.style = style;
        };
    
        return this;
    };
    
    // Gestion des animations de texte interactif
    var VFont = function () {

        this.flex = true;
    
        this.width = true;
        this.weight = true;
        var elements, charsByElement = [];
    
        this.init = function () {
            elements = document.querySelectorAll(".text-transition");
            elements.forEach((element) => {
                var str = element.innerText;
                element.innerHTML = "";
                var chars = [];
                for (var i = 0; i < str.length; i++) {
                    var _char = new Char(element, str[i]);
                    chars.push(_char);
                }
                charsByElement.push({ element, chars });
            });
            this.set();
            window.addEventListener("resize", this.setSize.bind(this));
        };
    
        this.set = function () {
            elements.forEach((element) => {
                element.className += " hoverable";
                element.className += this.flex ? " flex" : "";
                element.className += this.stroke ? " stroke" : "";
            });
            this.setSize();
        };
    
        this.setSize = function () {
            elements.forEach((element, index) => {
                var str = charsByElement[index].chars;
                var fontSize = window.innerWidth / (str.length / 2);
                element.style = "font-size: " + fontSize + "px;";
                if (this.scale) {
                    var scaleY = (window.innerHeight / element.getBoundingClientRect().height).toFixed(2);
                    var lineHeight = scaleY * 0.8;
                    element.style = "font-size: " + fontSize + "px; transform: scale(1," + scaleY + "); line-height: " + lineHeight + "em;";
                }
            });
        };
    
        this.animate = function () {
            mouse.x += (cursor.x - mouse.x) / 20;
            mouse.y += (cursor.y - mouse.y) / 20;
            requestAnimationFrame(this.animate.bind(this));
            this.render();
        };
    
        this.render = function () {
            elements.forEach((element, index) => {
                var chars = charsByElement[index].chars;
                maxDist = element.getBoundingClientRect().width / 2;
                for (var i = 0; i < chars.length; i++) {
                    chars[i].update({
                        wght: this.weight,
                        wdth: this.width,
                    
                    });
                }
            });
        };
    
        this.init();
        this.animate();
        return this;
    };
    
    // Initialisation de l'animation
    var txt = new VFont();
    

    // Animation des curseurs
    const initCustomCursor = () => {
        const $bigBall = document.querySelector('.cursor__ball--big');
        const $smallBall = document.querySelector('.cursor__ball--small');
        const $hoverables = document.querySelectorAll('.hoverable');

        const onMouseMove = (e) => {
            TweenMax.to($bigBall, 0.4, { x: e.pageX - 15, y: e.pageY - 15 });
            TweenMax.to($smallBall, 0.1, { x: e.pageX - 5, y: e.pageY - 7 });
        };

        const onMouseHover = () => {
            TweenMax.to($bigBall, 0.3, { scale: 12 });
            $bigBall.style.zIndex = "1";
            $smallBall.style.display = "none";
        };

        const onMouseHoverOut = () => {
            TweenMax.to($bigBall, 0.3, { scale: 1 });
            $bigBall.style.zIndex = "5";
            $smallBall.style.display = "block";
        };

        document.body.addEventListener('mousemove', onMouseMove);
        $hoverables.forEach(hoverable => {
            hoverable.addEventListener('mouseenter', onMouseHover);
            hoverable.addEventListener('mouseleave', onMouseHoverOut);
        });
    };

    // Animation des sections design et dev
    const initSectionHoverEffects = () => {
        const designSection = document.querySelector('.section-design');
        const devSection = document.querySelector('.section-dev');

        if (devSection && designSection) {
            devSection.classList.add('dev-active');

            designSection.addEventListener('mouseenter', () => {
                designSection.classList.add('design-active');
                devSection.classList.remove('dev-active');
            });

            devSection.addEventListener('mouseenter', () => {
                devSection.classList.add('dev-active');
                designSection.classList.remove('design-active');
            });

            designSection.addEventListener('mouseleave', () => designSection.classList.add('design-active'));
            devSection.addEventListener('mouseleave', () => devSection.classList.add('dev-active'));
        }
    };

    // Suivi des yeux
    const initEyeTracking = () => {
        const pupils = document.querySelectorAll(".eye .pupil");
        window.addEventListener("mousemove", (e) => {
            pupils.forEach(pupil => {
                const rect = pupil.getBoundingClientRect();
                const x = (e.pageX - rect.left) / 30 + "px";
                const y = (e.pageY - rect.top) / 30 + "px";
                pupil.style.transform = `translate3d(${x}, ${y}, 0px)`;
            });
        });
    };

    // Initialisation
    initNavbarForPortfolio();
    initSmoothScrollAndActiveLinks();
    initActiveSectionOnScroll();

    initCustomCursor();
    initSectionHoverEffects();
    initEyeTracking();
});
