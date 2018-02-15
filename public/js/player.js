var playerController = (function () {
    var arrVideoIds = [];
    var videoIDX = 0;
    var theme = "";
    init()
    
    function init() {
        _YoutubePlayer = new YoutubePlayer();
        _YoutubePlayer.init();

        bind_events()
    }

    function bind_events() {
        pubsub.on("PLAYER_API_READY", function(e){
            console.log("PLAYER_API_READY")
            _YoutubePlayer.initPlayer("player")
        })

        pubsub.on("PLAYER_READY", function(e){
            console.log("PLAYER_READY")
        });
        
        pubsub.on("PLAYLIST_RESULT", function(e){
            console.log("PLAYLIST_RESULT")
        });

        pubsub.on("PREV", function(e){
            console.log("PREV")
            if(videoIDX-1 >= 0)videoIDX--;
            else videoIDX = arrVideoIds.length-1;

            play_by_idx();
        });

        pubsub.on("NEXT", function(e){
            console.log("NEXT")
            if(videoIDX+1 < arrVideoIds.length)videoIDX++;
            else videoIDX = 0;

            play_by_idx();
        });

        pubsub.on("CONTRIB_NEW", function(e){
            arrVideoIds = [];
            $(".theme.active").find(".track").each(function(idx, el){
                var videoID = $(this).data("video_id");
                arrVideoIds.push(videoID);
            });
        });
        
        $("html").on("click", ".theme", function(e){
            e.stopPropagation();
            $(".theme").removeClass("active");
            $(this).addClass("active");

            arrVideoIds = [];
            videoIDX = 0;
            
            $(this).find(".track").each(function(idx, el){
                var videoID = $(this).data("video_id");
                //console.log(videoID)
                arrVideoIds.push(videoID);
            });

            //play_by_idx();
            
            
        });

        $("html").on("click", ".track:not(.is-playing)", function(e){
            e.stopPropagation();
            
            videoIDX = $(this).index();
            play_by_idx();
        });

        $("html").on("click", ".track.is-playing", function(e){
            e.stopPropagation();
            $(this).toggleClass("is-pause")
            pubsub.emit("SPACE")
        });
    }

    function play_by_idx() {
        //console.log(videoIDX)
        _YoutubePlayer.loadVideoById(arrVideoIds[videoIDX]);

        $(".track").removeClass("is-playing")
        $(".theme.active").find(".track").eq(videoIDX).addClass("is-playing");

        update_meta_title();
        //if(theme != $(".theme.active").find("h2").text().trim().toLowerCase())update_deco();
    }

    function update_meta_title() {
        var title = $(".theme.active").find(".track").eq(videoIDX).find("h3").text().trim();
        //console.log(title)
        titleScroller("MONOMIX ▶ "+title)
    }

    function titleScroller(text){
        document.title = text;
        //console.log(text);
        setTimeout(function () {
            titleScroller(text.substr(1) + text.substr(0, 1));
        }, 400);
    }

    function update_deco() {
        $("#deco").html("")
        theme = $(".theme.active").find("h2").text().trim().toLowerCase();
        var svg = "img/visuals/"+theme+".svg";
        var image= new Image();
        image.onload = function(){
            console.log(this)
            $("#deco").html(this)
        };
        image.src = svg;
        
    }

})();