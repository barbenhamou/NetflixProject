import './MovieWatch.css';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { backendPort } from "../config";

function MovieWatch({ id }) {
    const [movie, setMovie] = useState(null);
    const [isLoggedIn, setLoggedIn] = useState(true);

    useEffect(() => {
        async function fetchMovie() {
            const response = await fetch(`http://localhost:${backendPort}/api/movies/${id}`);


            const data = await response.json();
            setMovie(data);

            // Notify the recommendations system that the user watched this movie
            const watchResponse = await fetch(`http://localhost:${backendPort}/api/movies/${id}/recommend`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                }
            });

            if (watchResponse.status === 401) {
                setLoggedIn(false);
                return;
            } else {
                setLoggedIn(true);
            }
        }

        fetchMovie();
    }, [id]);

    if (!isLoggedIn) {
        return (
            <div className="logged-out">
                <p>You Need to <Link to={`/login`}>log in</Link> in order to watch this movie.
                    Don't have an account? <Link to={`/signup`}>Sign up</Link> now to get the best streaming content!</p>
            </div>
        );
    }

    // Show loading text until movie is fetched
    if (!movie) {
        return (
            <div className="loading">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="movie-watch">
            <Link to='/'> {/* TODO: Change to home page */}
                <i className="bi bi-house-door"></i>
            </Link>
            <div className="movie-video">
                <VideoPlayer movieId={id} type="film" />
            </div>
        </div>
    );
}

export default MovieWatch;