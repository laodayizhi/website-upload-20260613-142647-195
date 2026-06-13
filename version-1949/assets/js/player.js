function initializePlayer(options) {
    var video = document.getElementById(options.videoId);
    var overlay = document.getElementById(options.overlayId);
    var toggle = document.getElementById(options.toggleId);
    var mute = document.getElementById(options.muteId);
    var fullscreen = document.getElementById(options.fullscreenId);
    var errorBox = document.getElementById(options.errorId);
    var hls = null;
    var ready = false;

    if (!video) {
        return;
    }

    var setError = function () {
        if (errorBox) {
            errorBox.textContent = "播放暂时不可用，请稍后再试";
            errorBox.classList.add("is-visible");
        }
    };

    var setReady = function () {
        ready = true;
        if (errorBox) {
            errorBox.classList.remove("is-visible");
        }
    };

    var attach = function () {
        if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(options.source);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, setReady);
            hls.on(window.Hls.Events.ERROR, function (event, data) {
                if (data && data.fatal) {
                    setError();
                }
            });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = options.source;
            video.addEventListener("loadedmetadata", setReady, { once: true });
            video.addEventListener("error", setError, { once: true });
        } else {
            setError();
        }
    };

    var sync = function () {
        var playing = !video.paused;

        if (overlay) {
            overlay.classList.toggle("is-hidden", playing);
        }

        if (toggle) {
            toggle.textContent = playing ? "暂停" : "▶";
        }
    };

    var start = function () {
        if (!ready && !video.src && !hls) {
            attach();
        }

        var playPromise = video.play();

        if (playPromise && typeof playPromise.then === "function") {
            playPromise.then(sync).catch(function () {
                if (ready) {
                    sync();
                }
            });
        } else {
            sync();
        }
    };

    var togglePlay = function () {
        if (video.paused) {
            start();
        } else {
            video.pause();
            sync();
        }
    };

    attach();

    if (overlay) {
        overlay.addEventListener("click", start);
    }

    if (toggle) {
        toggle.addEventListener("click", togglePlay);
    }

    video.addEventListener("click", togglePlay);
    video.addEventListener("play", sync);
    video.addEventListener("pause", sync);

    if (mute) {
        mute.addEventListener("click", function () {
            video.muted = !video.muted;
            mute.textContent = video.muted ? "静音" : "音量";
        });
    }

    if (fullscreen) {
        fullscreen.addEventListener("click", function () {
            var shell = video.closest(".player-shell") || video;

            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else if (shell.requestFullscreen) {
                shell.requestFullscreen();
            }
        });
    }

    window.addEventListener("beforeunload", function () {
        if (hls) {
            hls.destroy();
        }
    });
}
