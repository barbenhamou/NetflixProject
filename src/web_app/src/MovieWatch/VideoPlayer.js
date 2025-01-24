import React, { useRef, useState, useEffect } from "react";
import "./VideoPlayer.css";

function VideoPlayer({ film }) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const togglePlay = () => {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e) => {
        videoRef.current.currentTime = e.target.value;
        setCurrentTime(e.target.value);
    };

    const toggleFullscreen = () => {
        const videoContainer = videoRef.current.parentElement;
        if (!isFullscreen) {
            if (videoContainer.requestFullscreen) {
                videoContainer.requestFullscreen();
            }
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const video = videoRef.current;

        if (video) {
            const updateProgressBar = () => {
                setCurrentTime(video.currentTime);
            };

            const updateDuration = () => {
                setDuration(video.duration);
            };

            video.addEventListener("timeupdate", updateProgressBar);
            video.addEventListener("loadedmetadata", updateDuration);

            return () => {
                video.removeEventListener("timeupdate", updateProgressBar);
                video.removeEventListener("loadedmetadata", updateDuration);
            };
        }

        // Listen for fullscreen state changes and update isFullscreen state
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                setIsFullscreen(false);  // Exiting fullscreen
            }
        };

        // Ensure fullscreen state is correctly updated on fullscreenchange
        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    // Ensure fullscreen state is updated when document exits fullscreen
    useEffect(() => {
        const videoContainer = videoRef.current.parentElement;

        const checkFullscreen = () => {
            if (document.fullscreenElement === videoContainer) {
                setIsFullscreen(true);
            } else {
                setIsFullscreen(false);
            }
        };

        // Check fullscreen on page load
        checkFullscreen();

        // Listen for when fullscreen is toggled
        document.addEventListener("fullscreenchange", checkFullscreen);

        return () => {
            document.removeEventListener("fullscreenchange", checkFullscreen);
        };
    }, []);

    const progress = (currentTime / duration) * 100;
    const barColor = "rgba(255, 255, 255, 0.3)";
    const progressBarStyle = {
        background: `linear-gradient(to right, red ${progress}%, ${barColor} ${progress}%, ${barColor} 100%)`,
    };

    return (
        <div className={`video-container ${isFullscreen ? "fullscreen" : ""}`}>
            <video
                className="movie-watch-video"
                ref={videoRef}
                src={`/Media/Movies/${film}`}
                onClick={togglePlay} />
            <div className="video-controls">
                <button className="play-pause" onClick={togglePlay}>
                    {isPlaying ? <i className="bi bi-pause"></i> : <i className="bi bi-play-fill"></i>}
                </button>
                <input
                    type="range"
                    className="progress-bar"
                    min="0"
                    max={duration || 100}
                    step="0.01"
                    value={currentTime}
                    onChange={handleSeek}
                    style={progressBarStyle}
                />
                <button className="fullscreen-btn" onClick={toggleFullscreen}>
                    {isFullscreen ? <i className="bi bi-fullscreen-exit"></i> : <i className="bi bi-fullscreen"></i>}
                </button>
            </div>
        </div>
    );
}

export default VideoPlayer;
