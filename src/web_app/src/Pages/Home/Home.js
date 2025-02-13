import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../../Utils/MovieCard/MovieCard";
import VideoPlayer from "../../Utils/VideoPlayer/VideoPlayer";
import ProfileDropdown from "../../Utils/ProfileDropdown/ProfileDropdown";
import { backendUrl } from "../../config";
import "./Home.css";

function Home() {
    const [movies, setMovies] = useState([]);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [headerHidden, setHeaderHidden] = useState(false);
    const [featuredMovie, setFeaturedMovie] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchedMovie, setSearchedMovie] = useState(null);

    const fetchMovies = async () => {
        try {
            // Get the list of movies by categories:
            // [
            //      [categoryName, [moviesOfCategory]],
            //      [categoryName, [moviesOfCategory]],
            //      ...
            // ]
            const response = await fetch(`${backendUrl}movies`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch movies: ${response.status}`);
            }

            const data = await response.json();
            setMovies(data);
            
            // Get a random movie to feature from the list of movies 
            const allMovies = data.map((movieList) => movieList[1]).flat();
            const randomIndex = Math.floor(Math.random() * allMovies.length);
            setFeaturedMovie(allMovies[randomIndex]);
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    // Header show/hide on scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY) {
                setHeaderHidden(true);
            } else {
                setHeaderHidden(false);
            }
            setLastScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    async function handleSearch(e) {
        e.preventDefault();

        // Perform a case-insensitive exact match search on the flat movies list
        const movie = movies.find(
            (movie) => movie.title.toLowerCase() === searchTerm.toLowerCase()
        );

        if (movie) {
            setSearchedMovie(movie);
        } else {
            alert("Movie doesn't exist");
            setSearchedMovie(null);
        }
    }

    const closeSearchResult = () => {
        setSearchedMovie(null);
        setSearchTerm("");
    };

    return (
        <div className="home-container">
            {/* Header Section */}
            <header className={`home-header ${headerHidden ? "hidden" : ""}`}>
                <span className="logo-text-home">
                    <img className="logo-home" alt="logo" src={`${process.env.PUBLIC_URL}/images/site-logo.png`}></img>
                    NEXFLIT
                </span>
                <nav className="home-nav">
                    {localStorage.getItem("isAdmin") === 'true' &&
                        <Link className="home-nav-link" to='/admin'>Admin Panel</Link>
                    }
                </nav>
                <form onSubmit={handleSearch} className="home-search-form">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="home-search-input"
                    />
                    <button className="home-search-button">
                        <i type="submit" className="bi bi-search home-search-icon"></i>
                    </button>
                </form>
                <ProfileDropdown />
            </header>

            {/* Search Result Modal */}
            {searchedMovie && (
                <div className="home-search-modal">
                    <MovieCard
                        showInfo={false}
                        infoButton={true}
                        {...searchedMovie}
                    />
                    <button onClick={closeSearchResult} className="home-close-button">
                        Close
                    </button>
                </div>
            )}

            {/* Featured Movie Section */}
            {featuredMovie && (
                <div className="home-featured-container">
                    <VideoPlayer movieId={featuredMovie.id} type="trailer" />
                    <div className="home-featured-header">
                        <h1>{featuredMovie.title}</h1>
                        <Link to={`/movies/${featuredMovie.id}/watch`}>
                            <button
                                className="btn btn-light play-btn-home"
                                type="button"
                                aria-label="Play" >
                                ▶ Play
                            </button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Category Rows */}
            {movies.map(([categoryName, movies]) => (
                <div className="home-category-row" key={categoryName}>
                    <h2 className="home-category-title">{categoryName}</h2>
                    <div className="movie-cards-container">
                        {movies.map((movie, index) => (
                            <MovieCard
                                key={index}
                                showInfo={false}
                                infoButton={true}
                                {...movie}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Home;