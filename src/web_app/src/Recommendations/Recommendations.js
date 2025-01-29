import "./Recommendations.css";
import { useState, useEffect } from "react";
import MovieCard from "../MovieCard/MovieCard";
import { backendPort } from "../config";

function Recommendations({ id }) {
    const [movies, setMovies] = useState(null);

    useEffect(() => {
        async function fetchMovie() {
            console.log(localStorage.getItem("authToken"));
            const response = await fetch(`http://localhost:${backendPort}/api/movies/${id}/recommend`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                }
            });
            //const data = await response.json();
            const testMovie = await fetch(`http://localhost:${backendPort}/api/movies/67936f2a686d1e3d89062f93`);
            const movieJson = await testMovie.json();
            const data = [movieJson, movieJson, movieJson, movieJson, movieJson, movieJson, movieJson, movieJson, movieJson, movieJson];
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
        return <MovieCard key={key} showDescription={true} infoButton={false} {...movie} />
    });

    return (
        <div className="recommendations">
            {movieList}
        </div>
    );
}

export default Recommendations;