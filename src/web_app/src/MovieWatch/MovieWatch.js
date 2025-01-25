import './MovieWatch.css';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import React, { useEffect, useState } from 'react';

function MovieWatch({ id }) {
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        async function fetchMovie() {
            const response = await fetch(`http://localhost:3001/api/movies/${id}`);
            const data = await response.json();
            setMovie(data);
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
            <i className="bi bi-arrow-left" onClick={() => window.history.back()}></i>
            <div className="movie-video">
                <VideoPlayer video={film} folder={"Movies"} />
            </div>
        </div>
    );    
}

export default MovieWatch;