import "./Recommendations.css";
import { useState, useEffect } from "react";
import MovieCard from "../MovieCard/MovieCard";
import { backendPort } from "../../config";
import { Link } from "react-router-dom"

function Recommendations({ id }) {
    const [movies, setMovies] = useState(null);
    const [isLoggedIn, setLoggedIn] = useState(true);

    useEffect(() => {
        async function fetchMovie() {
            const response = await fetch(`http://localhost:${backendPort}/api/movies/${id}/recommend`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                }
            });

            if (response.status === 401) {
                setLoggedIn(false);
                return;
            } else {
                setLoggedIn(true);
            }

            const data = await response.json();
            setMovies(data);
        }

        fetchMovie();
    }, [id]);

    if (!isLoggedIn) {
        return (
            <div className="logged-out">
                <p>You Need to <Link to={`/login`}>log in</Link> in order to get recommendations.
                    Don't have an account? <Link to={`/signup`}>Sign up</Link> now to get the best streaming content!</p>
            </div>
        );
    }

    // Show loading text until movies are fetched
    if (!movies) {
        return (
            <div className="loading">
                <p>Loading...</p>
            </div>
        );
    }

    const movieList = movies.map((movie, key) => {
        return <MovieCard key={key} showInfo={true} infoButton={false} {...movie} />
    });

    return (
        <div className="recommendations">
            {!movieList.length ? "Nothing to recommend yet." : movieList}
        </div>
    );
}

export default Recommendations;