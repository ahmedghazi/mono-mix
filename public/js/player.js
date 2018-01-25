var playerController = (function () {
    var arrVideoIds = [];
    var videoIDX = 0;
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

            playByIdx();
        });

        pubsub.on("NEXT", function(e){
            console.log("NEXT")
            if(videoIDX+1 < arrVideoIds.length)videoIDX++;
            else videoIDX = 0;

            playByIdx();
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

            //playByIdx();
            
        });

        $("html").on("click", ".track:not(.is-playing)", function(e){
            e.stopPropagation();
            
            videoIDX = $(this).index();
            playByIdx();
        });

        $("html").on("click", ".track.is-playing", function(e){
            e.stopPropagation();
            $(this).toggleClass("is-pause")
            pubsub.emit("SPACE")
        });
    }

    function playByIdx() {
        console.log(videoIDX)
        _YoutubePlayer.loadVideoById(arrVideoIds[videoIDX]);

        $(".track").removeClass("is-playing")
        $(".theme.active").find(".track").eq(videoIDX).addClass("is-playing");
    }

})();