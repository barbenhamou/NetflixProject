import './MovieWatch.css';
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

    const {film} = movie;

    return (
        <div className="movie-watch">
            <video
                src={`/Media/Movies/${film}`}
                controls>
                Your browser does not support the video tag.
            </video>
        </div>
    );
}

export default MovieWatch;