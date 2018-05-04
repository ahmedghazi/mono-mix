var headerController = (function () {
    
    init()
    
    function init() {
        bind_events()
    }

    function bind_events() {
        $("html").on("mouseenter", "h1", function(){
            var rand = 1 + Math.round(Math.random() * 2);
            //console.log(rand)
            $(this).attr("data-idx", rand)
        });

        
    
    }

})();