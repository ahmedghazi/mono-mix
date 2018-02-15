var contribController = (function () {
    
    init()
    
    function init() {
        bind_events()
    }

    function bind_events() {
        $(".contrib--form").on("submit", function(e){
            e.preventDefault();
            var $mix = $(this).parents(".item-body").children(".mix");
            var $input = $(this).find("input[type=text]")
            var url = $(this).attr("action");
            var data = $(this).serialize();
            
            $("body").addClass("loading");

            $.ajax({
              method: "POST",
              url: url,
              data: data
            })
            .done(function( data ) {
                console.log(data.status)
                if(data.status == true){
                    $mix.append(data.html)
                    $input.val("");
                }
                $("body").removeClass("loading");
            });
        })
    }

})();