import '../css/style.scss';

document.addEventListener('DOMContentLoaded', () => {
    var maxDist;
    var mouse = { x: 0, y: 0 };
    var cursor = {
        x: window.innerWidth,
        y: window.innerHeight
    };
    
    Math.dist = function(a, b) {
        var dx = b.x - a.x;
        var dy = b.y - a.y;
        return Math.sqrt(Math.pow(dx, 2), Math.pow(dy, 2));
    }
    
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
    
    var Char = function(container, char) {
        var span = document.createElement("span");
        span.setAttribute('data-char', char);
        span.innerText = char;
        container.appendChild(span);
        this.getDist = function() {
            this.pos = span.getBoundingClientRect();
            return Math.dist(mouse, {
                x: this.pos.x + (this.pos.width / 1.75),
                y: this.pos.y
            });
        }
        this.getAttr = function(dist, min, max) {
            var wght = max - Math.abs((max * dist / maxDist));
            return Math.max(min, wght + min);
        }
        this.update = function(args) {
            var dist = this.getDist();
            this.wdth = args.wdth ? ~~this.getAttr(dist, 12, 50) : 100;
            this.wght = args.wght ? ~~this.getAttr(dist, 300, 700) : 400;
            this.alpha = args.alpha ? this.getAttr(dist, 0, 1).toFixed(2) : 1;
            this.ital = args.ital ? this.getAttr(dist, 0, 1).toFixed(2) : 0;
            this.draw();
        }
        this.draw = function() {
            var style = "";
            style += "opacity: " + this.alpha + ";";
            style += "font-variation-settings: 'wght' " + this.wght + ", 'wdth' " + this.wdth + ", 'ital' " + this.ital + ";";
            span.style = style;
        }
        return this;
    }
    
    var VFont = function() {
        this.scale = false;
        this.flex = true;
        this.alpha = false;
        this.stroke = false;
        this.width = true;
        this.weight = true;
        this.italic = true;
        var elements, charsByElement = [];
    
        this.init = function() {
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
        }
    
        this.set = function() {
            elements.forEach((element) => {
                element.className += " hoverable";
                element.className += this.flex ? " flex" : "";
                element.className += this.stroke ? " stroke" : "";
            });
            this.setSize();
        }
    
        this.setSize = function() {
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
        }
    
        this.animate = function() {
            mouse.x += (cursor.x - mouse.x) / 20;
            mouse.y += (cursor.y - mouse.y) / 20;
            requestAnimationFrame(this.animate.bind(this));
            this.render();
        }
    
        this.render = function() {
            elements.forEach((element, index) => {
                var chars = charsByElement[index].chars;
                maxDist = element.getBoundingClientRect().width / 2;
                for (var i = 0; i < chars.length; i++) {
                    chars[i].update({
                        wght: this.weight,
                        wdth: this.width,
                        ital: this.italic,
                        alpha: this.alpha
                    });
                }
            });
        }
        this.init();
        this.animate();
        return this;
    }
    
    var txt = new VFont();

    document.querySelectorAll('.wp-block-button__link').forEach(element => {
        element.classList.add('hoverable');
    });

    const $bigBall = document.querySelector('.cursor__ball--big');
    const $smallBall = document.querySelector('.cursor__ball--small');
    const $hoverables = document.querySelectorAll('.hoverable');
    console.log($hoverables);
    // Listeners
    document.body.addEventListener('mousemove', onMouseMove);
    for (let i = 0; i < $hoverables.length; i++) {
        $hoverables[i].addEventListener('mouseenter', onMouseHover);
        $hoverables[i].addEventListener('mouseleave', onMouseHoverOut);
    }

    // Move the cursor
    function onMouseMove(e) {
        TweenMax.to($bigBall, 0.4, {
            x: e.pageX - 15,
            y: e.pageY - 15
        });
        TweenMax.to($smallBall, 0.1, {
            x: e.pageX - 5,
            y: e.pageY - 7
        });
    }

    // Hover an element
    function onMouseHover() {
        TweenMax.to($bigBall, 0.3, {
            scale: 12
        });
        $bigBall.style.zIndex = "1";
        $smallBall.style.display = "none";
    }

    function onMouseHoverOut() {
        TweenMax.to($bigBall, 0.3, {
            scale: 1
        });
        $bigBall.style.zIndex = "5";
        $smallBall.style.display = "block";
    }

      // Sélectionnez les deux sections
  const designSection = document.querySelector('.section-design');
  const devSection = document.querySelector('.section-dev');
  devSection.classList.add('dev-active');
  // Ajout des événements hover
  designSection.addEventListener('mouseenter', () => {
    // Appliquer les couleurs correspondantes
    designSection.classList.add('design-active');
    devSection.classList.remove('dev-active');
  });

  devSection.addEventListener('mouseenter', () => {
    // Appliquer les couleurs correspondantes
    devSection.classList.add('dev-active');
    designSection.classList.remove('design-active');
  });

  // (Facultatif) Réinitialiser les couleurs lorsque la souris quitte les sections
  designSection.addEventListener('mouseleave', () => {

    designSection.classList.add('design-active');
  });

  devSection.addEventListener('mouseleave', () => {
   
    devSection.classList.add('dev-active');
  });

});
