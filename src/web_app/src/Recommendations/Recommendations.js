import "./Recommendations.css";
import { useState, useEffect } from "react";
import MovieCard from "../MovieCard/MovieCard";

function Recommendations({ id }) {
    const [movies, setMovies] = useState(null);

    useEffect(() => {
        async function fetchMovie() {
            const response = await fetch(`http://localhost:3001/api/movies/${id}/recommend`, {
                headers: {
                    // TODO: add token
                    "Authorization": "Bearer 6791285f2a7b20941e6ca000",
                }
            });
            const data = await response.json();
            setMovies(data);
        }

        fetchMovie();
    }, []);

    // Show loading text until movies are fetched
    if (!movies) {
        return (
            <div className="loading">
                <p>Loading...</p>
            </div>
        );
    }
    
    const movieList = movies.map((movie, key) => {
        return <MovieCard key={key} {...movie} />
    });

    return (
        <div className="recommendations">
            {movieList}
        </div>
    );
}

export default Recommendations;