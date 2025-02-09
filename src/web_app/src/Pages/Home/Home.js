import React, { useState, useEffect } from "react";
import MovieCard from "../../Utils/MovieCard/MovieCard";
import VideoPlayer from "../../Utils/VideoPlayer/VideoPlayer";
import { backendPort } from "../../config";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [categories, setCategories] = useState({});
    const [lastScrollY, setLastScrollY] = useState(0);
    const [headerHidden, setHeaderHidden] = useState(false);
    const [featuredMovie, setFeaturedMovie] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchedMovie, setSearchedMovie] = useState(null);

    const fetchMovies = async () => {
        try {
            const headers = {
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                "Content-Type": "application/json",
            };

            const response = await fetch(`http://localhost:${backendPort}/api/movies`, {
                headers: headers,
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch movies: ${response.status}`);
            }

            const data = await response.json();

            const categorizedMovies = data.reduce((acc, category) => {
                if (category.length > 0) {
                    // Use the first category name found or default to "Uncategorized"
                    const categoryName = category[0]?.categories[0] || "Uncategorized";
                    acc[categoryName] = category.map((movie) => ({
                        id: movie.id,
                        title: movie.title,
                        description: movie.description || "An amazing movie you shouldn't miss!",
                        // Pass along categories (or default to an array with the categoryName)
                        categories: movie.categories || [categoryName],
                        // Provide default values if not available
                        lengthMinutes: movie.lengthMinutes || 120,
                        releaseYear: movie.releaseYear || 2020,
                    }));
                }
                return acc;
            }, {});

            // Store the flat list of movies for search purposes
            const flatMovies = data.flat();
            setMovies(flatMovies);
            setCategories(categorizedMovies);

            // Pick a random featured movie from the flat list
            const randomMovie =
                flatMovies[Math.floor(Math.random() * flatMovies.length)];
            setFeaturedMovie({
                id: randomMovie.id,
                title: randomMovie.title,
                description: randomMovie.description || "Enjoy our featured selection!",
                categories: randomMovie.categories || [],
                lengthMinutes: randomMovie.lengthMinutes || 120,
                releaseYear: randomMovie.releaseYear || 2020,
            });
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

    const handleSearch = (e) => {
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
    };

    const closeSearchResult = () => {
        setSearchedMovie(null);
        setSearchTerm("");
    };

    return (
        <div className="home-container">
            {/* Header Section */}
            <header className={`home-header ${headerHidden ? "hidden" : ""}`}>
                <span className="logo-text">Nexflit</span>
                <nav className="home-nav">
                    <div className="home-nav-link">
                        <Link to='/'>Home</Link>
                    </div>
                    {localStorage.getItem("isAdmin") === 'true' &&
                        <div className="home-nav-link">
                            <Link to='/admin'>Admin Panel</Link>
                        </div>}
                    <div className="home-nav-link" onClick={() => {
                        localStorage.setItem("authToken", "");
                        localStorage.setItem("isAdmin", false);
                    }}>
                        <Link to='/login'>Logout</Link>
                    </div>
                </nav>
                <form onSubmit={handleSearch} className="home-search-form">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="home-search-input"
                    />
                    <button type="submit" className="home-search-button">
                        Search
                    </button>
                </form>
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
                    <h1 className="home-featured-header"></h1>
                    <VideoPlayer movieId={featuredMovie.id} type="trailer" />
                </div>
            )}

            {/* Category Rows */}
            {Object.entries(categories).map(([categoryName, categoryMovies]) => (
                <div className="home-category-row" key={categoryName}>
                    <h2 className="home-category-title">{categoryName}</h2>
                    <div className="movie-cards-container">
                        {categoryMovies.map((movie, index) => (
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
};

export default Home;