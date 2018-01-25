var YoutubePlayer = function(){
	var _this = this,
		context,
		player,
		enterFrame,
		PIETIMER,
		el,
		IDX,
		duration,
		PROGRESSION;
	
	this.init = function(){
		//el = $("#player");

		this.initScript();
		this.bindEvents();


	};
	
	this.initScript = function(){
		var tag = document.createElement('script');
      	tag.src = "//www.youtube.com/iframe_api";
      	var firstScriptTag = document.getElementsByTagName('script')[0];
    	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	};
	
	this.bindEvents = function(){
		$(document).keydown(function(e) {
		    if (e.which == 32) {
		    	pubsub.emit("SPACE")
		        return false;
		    }
		});

		pubsub.on("SPACE", function(e){
			if(player.getPlayerState() == 1){
				_this.pause();
			}else{
				_this.play();
			}
		});

		$(document).keyup(function(evt) {
		    
		    if (evt.keyCode == 39) {
		    	//$("html").trigger("NEXT",[IDX]);
		    	pubsub.emit("NEXT")
		    }
		    if (evt.keyCode == 37) {
		    	//$("html").trigger("PREV",[IDX]);
		    	pubsub.emit("PREV")
		    }
		})

		$("#player").find(".play").on("click", function(){
			_this.play();
		});

		$("#player").find(".pause").on("click", function(){
			_this.pause();
		});

		$("#player").find(".backward").on("click", function(){
			//$("html").trigger("PREV",[IDX]);
			pubsub.emit("PREV")
		});

		$("#player").find(".forward").on("click", function(){
			//$("html").trigger("NEXT",[IDX]);
			pubsub.emit("NEXT")
		});
		
		$(".mute").on("click", function(){
			if(player.getVolume() == 0){
				$(this).children("i")
					.removeClass("fa-volume-off")
					.addClass("fa-volume-up");
				player.setVolume(100);
			}else{
				$(this).children("i")
					.removeClass("fa-volume-up")
					.addClass("fa-volume-off");
				player.setVolume(0);
			}
		});

	};
	
	this.initPlayer = function(holder){
		context = holder;

		player = new YT.Player(holder, {
          	height: $("#"+holder).height(),
          	width: $("#"+holder).width(),
          	videoId: '',
          	events: {
            	'onReady': _this.onPlayerReady,
            	'onStateChange': _this.onPlayerStateChange,
            	'onError': _this.onPlayerError
          	},
			playerVars: {
            	controls	:'0',
				rel			:'0',
				showinfo	:'0',
				modestbranding:'0',
				iv_load_policy:'3',
				cc_load_policy:'0'
          	}
        });
		
	};
	
	this.onPlayerReady = function(event){
		//$("html").trigger("PLAYER_READY",[]);
		pubsub.emit("PLAYER_READY")
	};
	
	this.onPlayerStateChange = function(event){
		console.log(event.data)
		switch(event.data){		
			case -1:
				$("body").addClass("loading");
			break;
			case 0:
				clearInterval(enterFrame);
				//Piecon.reset()
				//Piecon.setProgress(50);
				//$("html").trigger("NEXT",[IDX]);
				pubsub.emit("NEXT")
			break;
			case 1:
				duration = player.getDuration();
				enterFrame = setInterval(_this.update, 250);			
				//PIETIMER = setInterval(_this.updatePie, 2000);		
				$("body").removeClass("loading");

				//$(el).addClass("currentItemPlaying").removeClass("state_pause");
				//$("#player").removeClass('state_pause');
			break;
			case 2:
				clearInterval(enterFrame);
				//$(el).removeClass("currentItemPlaying").addClass("state_pause");
				//$("#player").addClass('state_pause');
			break;
			case 3:
				$("body").addClass("loading");
			break;
		}
	};

	this.onPlayerError = function(event){
		//console.log("error",event.data)
		//clearInterval(enterFrame);
		//clearInterval(PIETIMER);
		//Piecon.reset()
		//$("html").trigger("NEXT",[IDX]);
		pubsub.emit("NEXT")
	};
	
	this.updatePie = function(){
		console.log(PROGRESSION)
		//Piecon.setProgress(PROGRESSION*100);
	};

	this.update = function(){
		
		var seconds = secondsToHms( player.getCurrentTime() );
		//$(".time").text(seconds+"/"+secondsToHms(duration));
		$(".track.is-playing").find(".time").text(seconds+"/"+secondsToHms(duration));

		var prog = player.getVideoLoadedFraction();
		var percent = (player.getCurrentTime() / duration);
		var pw = $("#player").width();
		
		//buffer
		var progress = pw * prog;
		//$("#player").find(".buffer").css("width",progress)

		//scrubber
		var w = pw * percent;
		//$("#player").find(".scrubber").css("width",w)

		PROGRESSION = percent;
	//	Piecon.setProgress(percent*100);
	}
	
	this.loadVideoByUrl = function(url){
		console.log(url)
		player.loadVideoByUrl(url);
	};

	this.loadVideoById = function(_id){
		//player.stopVideo();
		//$("#player").removeClass('offside_bottom');
		console.log(_id)
		player.loadVideoById(_id);
	};
	
	this.play = function(){
		player.playVideo();
		//$("#player").removeClass('state_pause');
	};
	
	this.stop = function(){
		player.stopVideo();
		//$("#player").addClass('state_pause');
	};
	
	this.pause = function(){
		player.pauseVideo();
		//$("#player").addClass('state_pause');
	};
	
	this.setVolume = function(val){
		player.setVolume(val);
	};
	
	this.currentItem = function(_el){
		el = _el;
		IDX = $(el).index();
		//Piecon.setOptions({color: rgb2hex($(el).css("background-color"))});

		$("body").on("click", '.track_seek', function(e){
			//console.log(e.pageX)
			var xpos = e.offsetX === undefined ? e.originalEvent.layerX : e.offsetX;
			var percent = xpos / $(this).width() * 100;
			var duration = player.getDuration();
			var pos = duration * percent / 100;
			player.seekTo(pos,true);
		});
	};

	this.updateTitle = function(_title){
		//$("#player").find(".track").text(_title);
	}
}

//IMPORTANT MUST BE OUTSIDE THIS OBJECT SCOPE
function onYouTubeIframeAPIReady() {
	//$("html").trigger("PLAYER_API_READY",[]);
	pubsub.emit("PLAYER_API_READY")
}

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s); 
}