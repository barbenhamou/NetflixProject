import "./Recommendations.css";
import { useState, useEffect } from "react";
import MovieCard from "../MovieCard/MovieCard";

function Recommendations() {
    const [movies, setMovies] = useState(null);

    useEffect(() => {
        async function fetchMovie() {
            const response = await fetch(`http://localhost:3001/api/movies`, {
                headers: {
                    "Authorization": "Bearer 678ff093f99c3ec60000fafe",
                }
            });
            const data = await response.json();
            setMovies(data);
        }

        fetchMovie();
    }, []);

    // Show loading text until movie is fetched
    if (!movies) {
        return (
            <div className="recommendations">
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