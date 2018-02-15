var searchController = (function () {
    
    init()
    
    function init() {
        bind_events()
    }

    function bind_events() {
        $("html").on("click", "#search-wrap button[type=submit]", function(e){
            e.preventDefault();
            $("label").click()
        });

        $("html").on("click", "#close", function(e){
            $("#search-wrap").removeClass("is-active")
        });

        $("html").on("click", "#search-wrap .layer", function(e){
            $("#search-wrap").removeClass("is-active")
        });

        $(document).keydown(function(e) {
            if (e.which == 27) {
                $("#search-wrap").removeClass("is-active")
            }
        });

        $("html").on("click", "#search-wrap label", function(){
            console.log("label")
            $(this).parents("#search-wrap").toggleClass("is-active")
            if($(this).parents("#search-wrap").hasClass("is-active")){
                setTimeout(function(){
                    $("input[name='s']").focus();
                }, 400);
            }else{
                
            }

        });

        $(document).on( 'keyup', '#s', function(e) {
            e.stopPropagation();

            var value = this.value;

            if(this.value.length > 3){
                $("body").addClass("loading");
                $.ajax({
                  method: "GET",
                  url: '/s/'+value
                })
                .done(function( data ) {
                    $('.themes').html($(".themes", data).html());
                    history.pushState({}, 'SEARCHING : '+value, '/s/'+value)
                    //if(!data)get_page(document.title, "/")
                    $("body").removeClass("loading");
                });
            }
        });
        

    }

})();