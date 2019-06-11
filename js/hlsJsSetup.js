function createVideo(videoPath) {
    console.log(videoPath);
    if (!Hls.isSupported) {
        console.log("HLS NOT SUPPORTED");
        return document.createElement("video").innerHTML("HLS NOT SUPPORTED");
    }
    var video = document.createElement("video"); //.controls = true;
    var config = {
        //debug: true,
        xhrSetup: function(xhr, url) {
            xhr.withCredentials = true;
        }
    }
    var hls = new Hls(config);
    hls.loadSource(videoPath);
    hls.on(Hls.Events.MANIFEST_PARSED, function() {
        console.log(hls);
    });
    hls.attachMedia(video);

    return video;
}

function createHls(videoPath) {

    if (!Hls.isSupported) {
        console.log("HLS NOT SUPPORTED");
        return document.createElement("video").innerHTML("HLS NOT SUPPORTED");
    }

    var config = {
        //debug: true,
        xhrSetup: function(xhr, url) {
            xhr.withCredentials = true;
            xhr.setRequestHeader('CORS', "http://localhost")
        }
    }
    var hls = new Hls(config);
    hls.loadSource(videoPath);
    hls.on(Hls.Events.MANIFEST_PARSED, function() {
        return hls;
    });


}

function createOptionsPanel() {

}