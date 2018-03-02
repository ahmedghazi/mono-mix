/*var screenSaverController = (function () {
    var div;
    var bounding;
    var xPos = 0,
        yPos = 0,
        step = 2,
        xon,yon;

    var speed = {
        x: 2,
        y: 2
    };

    var raf;

    init()
    
    function init() {
        div = document.querySelector(".logo");
        bounding = div.getBoundingClientRect()

        start()

        
    }

    function stop(){
        cancelAnimationFrame(raf);
    }

    function start(){
        update()
    }

    function update() {
        raf = requestAnimationFrame(update);

        if(!$("body").hasClass("loading"))return;

        if (yon) {
            yPos = yPos + step;
        } else {
            yPos = yPos - step;
        }
        if (yPos <= 0) {
            yon = 1;
            yPos = 0;
        }
        if (yPos >= (window.innerHeight - bounding.height)) {
            yon = 0;
            yPos = (window.innerHeight - bounding.height);
        }
        if (xon) {
            xPos = xPos + step;
        } else {
            xPos = xPos - step;
        }
        if (xPos <= 0) {
            xon = 1;
            xPos = 0;
        }
        if (xPos >= (window.innerWidth - bounding.width)) {
            xon = 0;
            xPos = (window.innerWidth - bounding.width);
        }

        div.style.transform = 'translate3d(' + xPos + 'px,' + yPos + 'px, 0)';
        div.style.OTransform = 'translate3d(' + xPos + 'px,' + yPos + 'px, 0)';
        div.style.msTransform = 'translate3d(' + xPos + 'px,' + yPos + 'px, 0)';
        div.style.MozTransform = 'translate3d(' + xPos + 'px,' + yPos + 'px, 0)';
        div.style.WebkitTransform = 'translate3d(' + xPos + 'px,' + yPos + 'px, 0)';
        
    }

})();*/