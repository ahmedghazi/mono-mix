var ww,wh,
	dbg;

jQuery(document).ready(function ($) {
	format();
});

$(window).resize(function(){ 
	format();
});

$(window).load(function(){ 
	$("#wrapper").removeClass("hidden");
	init();
});



function init(){
	//if(window.location.hostname == "localhost")dbg = true;
	dbg = window.location.hostname == "localhost";
	isTouchDevice = 'ontouchstart' in document.documentElement;
	
	bindEvents();
	initObjects();
}

function initObjects(){
	
}

function bindEvents(){
	

}

function format(){
	ww = $(window).width();
	wh = $(window).height();

	
}