

var audioContext = null;
var meter = null;
var rafID = null;

window.onload = function() {

    // grab our canvas
    //canvasContext = document.getElementById( "meter" ).getContext("2d");
    
    // monkeypatch Web Audio
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    
    // grab an audio context
    audioContext = new AudioContext();

    // Attempt to get audio input
    try {
        // monkeypatch getUserMedia
        navigator.getUserMedia = 
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;

        // ask for an audio input
        navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, onMicrophoneGranted, onMicrophoneDenied);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }

}

function onMicrophoneDenied() {
    console.log('Stream generation failed. Please allow mic');
}

var mediaStreamSource = null;

function onMicrophoneGranted(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);

    // kick off the visual updating
    onLevelChange();
}

function onLevelChange( time ) {
    
    //console.log(meter.volume);
    pubsub.emit("_onLevelChange", meter.volume)
    $(".theme.active").find(".deco").css({
        transform:"translate(-50%, -50%) scale("+(0.5+meter.volume)+", "+(0.5+meter.volume)+")"
    })
    // set up the next visual callback
    rafID = window.requestAnimationFrame( onLevelChange );
}