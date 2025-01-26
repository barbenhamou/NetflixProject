import React, { useRef, useState, useEffect } from "react";
import "./VideoPlayer.css";
import { backendPort } from "../config";

function VideoPlayer({ movieId, type }) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        setVolume(newVolume);
        videoRef.current.volume = newVolume;
    };

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

    const skipTime = (seconds) => {
        if (videoRef.current) {
            videoRef.current.currentTime = Math.min(
                Math.max(videoRef.current.currentTime + seconds, 0),
                duration
            );
            setCurrentTime(videoRef.current.currentTime);
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

    const formatTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        } else {
            return `${minutes}:${seconds.toString().padStart(2, "0")}`;
        }
    };

    const progress = (currentTime / duration) * 100;
    const barColor = "rgba(255, 255, 255, 0.3)";
    const progressBarStyle = {
        background: `linear-gradient(to right, red ${progress}%, ${barColor} ${progress}%, ${barColor} 100%)`,
    };

    if (progress === 100 && isPlaying) {
        setCurrentTime(0);
        setIsPlaying(false);
    }

    return (
        <div className={`video-container ${isFullscreen ? "fullscreen" : ""}`}>
            <video
                id="player"
                className="movie-watch-video"
                ref={videoRef}
                onClick={togglePlay}
                muted={false}
            >
                <source src={`http://localhost:${backendPort}/api/movies/${movieId}/files?type=${type}`} />
            </video>
            <div className="video-controls">
                <button className="skip-btn" onClick={() => skipTime(-10)}>
                    <i className="bi bi-arrow-counterclockwise"></i>
                </button>
                <button className="play-pause" onClick={togglePlay}>
                    {isPlaying ? <i className="bi bi-pause"></i> : <i className="bi bi-play-fill"></i>}
                </button>
                <button className="skip-btn" onClick={() => skipTime(10)}>
                    <i className="bi bi-arrow-clockwise"></i>
                </button>
                <div className="volume-control">
                    {volume > 0 ?
                        <i className="bi bi-volume-up volume-btn" onClick={() => {
                            setVolume(0);
                            handleVolumeChange({ target: { value: 0 } });
                        }}></i> :
                        <i className="bi bi-volume-mute volume-btn" onClick={() => {
                            setVolume(1);
                            handleVolumeChange({ target: { value: 1 } });
                        }}></i>}
                    <input
                        type="range"
                        className="volume-bar"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                    />
                </div>

                <div className="time-display">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </div>
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
