import './MovieWatch.css';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { backendPort } from "../config";

function MovieWatch({ id }) {
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        async function fetchMovie() {
            const response = await fetch(`http://localhost:${backendPort}/api/movies/${id}`);
            const data = await response.json();
            setMovie(data);
            await fetch(`http://localhost:${backendPort}/api/movies/${id}/recommend`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                }
            });
        }

        fetchMovie();
    }, [id]);

    // Show loading text until movie is fetched
    if (!movie) {
        return (
            <div className="movie-watch">
                <p>Loading...</p>
            </div>
        );
    }

    const { film } = movie;

    return (
        <div className="movie-watch">
            <Link to='/'> {/* TODO: Change to home page */}
                <i className="bi bi-arrow-left"></i>
            </Link>
            <div className="movie-video">
                <VideoPlayer movieId={id} type="film" />
            </div>
        </div>
    );
}

export default MovieWatch;