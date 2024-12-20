import '../css/style.scss';

document.addEventListener('DOMContentLoaded', () => {
    var maxDist;
    var mouse = { x: 0, y: 0 };
    var cursor = {
        x: window.innerWidth,
        y: window.innerHeight
    };
    
    // Fonction pour calculer la distance entre deux points
    Math.dist = function(a, b) {
        var dx = b.x - a.x;
        var dy = b.y - a.y;
        return Math.sqrt(Math.pow(dx, 2), Math.pow(dy, 2));
    }

    // Suivi du curseur
    window.addEventListener("mousemove", function(e) {
        cursor.x = e.clientX;
        cursor.y = e.clientY;
    });

    window.addEventListener("touchmove", function(e) {
        var t = e.touches[0];
        cursor.x = t.clientX;
        cursor.y = t.clientY;
    }, {
        passive: false
    });

    // Définir la classe Char pour chaque caractère
    var Char = function(container, char) {
        var span = document.createElement("span");
        span.setAttribute('data-char', char);
        span.innerText = char;
        container.appendChild(span);
        
        // Calcul de la distance entre le curseur et le caractère
        this.getDist = function() {
            this.pos = span.getBoundingClientRect();
            return Math.dist(mouse, {
                x: this.pos.x + (this.pos.width / 1.75),
                y: this.pos.y
            });
        }

        // Calcul du poids, de la largeur, de l'italique, etc.
        this.getAttr = function(dist, min, max) {
            var wght = max - Math.abs((max * dist / maxDist));
            return Math.max(min, wght + min);
        }

        // Mise à jour du style du caractère en fonction de la distance
        this.update = function(args) {
            var dist = this.getDist();
            this.wdth = args.wdth ? ~~this.getAttr(dist, 5, 200) : 100;
            this.wght = args.wght ? ~~this.getAttr(dist, 200, 700) : 400;
            this.alpha = args.alpha ? this.getAttr(dist, 0, 1).toFixed(2) : 1;
            this.ital = args.ital ? this.getAttr(dist, 0, 1).toFixed(2) : 0;
            this.draw();
        }

        // Applique le style au caractère
        this.draw = function() {
            var style = "";
            style += "opacity: " + this.alpha + ";";
            style += "font-variation-settings: 'wght' " + this.wght + ", 'wdth' " + this.wdth + ", 'ital' " + this.ital + ";";
            span.style = style;
        }
        
        return this;
    }

    // Classe principale pour gérer le titre animé
    var VFont = function() {
        this.scale = false;
        this.flex = true;
        this.alpha = false;
        this.stroke = false;
        this.width = true;
        this.weight = true;
        this.italic = true;

        var title, str, chars = [];

        // Initialisation de l'animation
        this.init = function() {
            title = document.getElementById("title");
            
            if (!title) {
                console.error("L'élément #title n'a pas été trouvé !");
                return;
            }

            str = title.innerText;
            title.innerHTML = "";
            for (var i = 0; i < str.length; i++) {
                var _char = new Char(title, str[i]);
                chars.push(_char);
            }
            this.set();
            window.addEventListener("resize", this.setSize.bind(this));
        }

        // Applique les classes et met à jour la taille
        this.set = function() {
            title.className = "";
            title.className += this.flex ? " flex" : "";
            title.className += this.stroke ? " stroke" : "";
            this.setSize();
        }

        // Ajuste la taille du titre en fonction de la taille de la fenêtre
        this.setSize = function() {
            var fontSize = window.innerWidth / (str.length / 2);
            title.style = "font-size: " + fontSize + "px;";
            if (this.scale) {
                var scaleY = (window.innerHeight / title.getBoundingClientRect().height).toFixed(2);
                var lineHeight = scaleY * 0.8;
                title.style = "font-size: " + fontSize + "px; transform: scale(1," + scaleY + "); line-height: " + lineHeight + "em;"
            }
        }

        // Animation de suivi du curseur
        this.animate = function() {
            mouse.x += (cursor.x - mouse.x) / 20;
            mouse.y += (cursor.y - mouse.y) / 20;
            requestAnimationFrame(this.animate.bind(this));
            this.render();
        }

        // Rendu de l'animation
        this.render = function() {
            maxDist = title.getBoundingClientRect().width / 2;
            for (var i = 0; i < chars.length; i++) {
                chars[i].update({
                    wght: this.weight,
                    wdth: this.width,
                  
                    alpha: this.alpha
                });
            }
        }

        this.init();
        this.animate();
        return this;
    }

    // Si tu veux initialiser l'animation, tu peux appeler :
    var fontAnimation = new VFont();
});
