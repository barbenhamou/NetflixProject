import React, { useState, useEffect } from "react";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState({});
  const [lastScrollY, setLastScrollY] = useState(0);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedMovie, setSearchedMovie] = useState(null);

  const fetchMovies = async () => {
    try {
      const token = "67968dcde28b283216601ce0"; // Replace this with your actual token

      const response = await fetch("http://localhost:3001/api/movies", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch movies: ${response.status}`);
      }

      const data = await response.json();

      const categorizedMovies = data.reduce((acc, category) => {
        if (category.length > 0) {
          const categoryName = category[0]?.categories[0] || "Uncategorized";
          acc[categoryName] = category.map((movie) => ({
            id: movie.id,
            title: movie.title,
            img: `Media/MovieImages/${movie.image}`,
            trailer: `Media/MovieTrailers/${movie.trailer}`,
            description: movie.description || "An amazing movie you shouldn't miss!",
          }));
        }
        return acc;
      }, {});

      setMovies(data.flat());
      setCategories(categorizedMovies);

      // Pick a random featured movie
      const flatMovies = data.flat();
      const randomMovie =
        flatMovies[Math.floor(Math.random() * flatMovies.length)];
      setFeaturedMovie({
        title: randomMovie.title,
        trailer: `Media/MovieTrailers/${randomMovie.trailer}`,
        description: randomMovie.description || "Enjoy our featured selection!",
      });
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Handle header show/hide on scroll
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
  
    // Perform case-insensitive exact match
    const movie = movies.find(
      (movie) => movie.title.toLowerCase() === searchTerm.toLowerCase()
    );
  
    if (movie) {
      setSearchedMovie(movie);
    } else {
      alert("Movie doesn't exist"); // Show a message if no match is found
      setSearchedMovie(null);
    }
  };

  const closeSearchResult = () => {
    setSearchedMovie(null);
    setSearchTerm("");
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "white", backgroundColor: "#141414" }}>
      {/* Header Section */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          padding: "20px",
          background: "rgba(0, 0, 0, 0.7)",
          position: "fixed",
          top: headerHidden ? "-70px" : "0",
          width: "100%",
          zIndex: 10,
          transition: "top 0.3s ease",
        }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
          alt="Netflix Logo"
          style={{ height: "40px" }}
        />
        <nav style={{ marginLeft: "30px", display: "flex", gap: "15px", flexGrow: 1 }}>
          <a href="#" style={{ color: "white", textDecoration: "none", fontSize: "20px" }}>
            Home
          </a>
          <a href="#" style={{ color: "white", textDecoration: "none", fontSize: "20px" }}>
            TV Shows
          </a>
          <a href="#" style={{ color: "white", textDecoration: "none", fontSize: "20px" }}>
            Movies
          </a>
          <a href="#" style={{ color: "white", textDecoration: "none", fontSize: "20px" }}>
            New & Popular
          </a>
          <a href="#" style={{ color: "white", textDecoration: "none", fontSize: "20px" }}>
            My List
          </a>
        </nav>
        <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "5px",
              fontSize: "16px",
              borderRadius: "4px",
              border: "1px solid gray",
              background: "rgba(255, 255, 255, 0.1)",
              color: "white",
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#e50914",
              border: "none",
              padding: "5px 10px",
              fontSize: "16px",
              color: "white",
              borderRadius: "4px",
              marginLeft: "5px",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </form>
      </header>

      {/* Search Result Full-Page View */}
      {searchedMovie && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#141414",
            color: "white",
            zIndex: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <video
            src={`Media/MovieTrailers/${searchedMovie.trailer}`}
            autoPlay
            muted
            loop
            style={{
              width: "80%",
              height: "50%",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          ></video>
          <h1 style={{ marginTop: "20px", fontSize: "36px" }}>{searchedMovie.title}</h1>
          <p style={{ marginTop: "10px", fontSize: "18px" }}>{searchedMovie.description}</p>
          <button
            onClick={closeSearchResult}
            style={{
              marginTop: "20px",
              backgroundColor: "#e50914",
              border: "none",
              padding: "10px 20px",
              fontSize: "16px",
              color: "white",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      )}

      {/* Featured Movie Section */}
      {featuredMovie && (
        <div style={{ position: "relative", height: "70vh", marginBottom: "20px" }}>
          <video
            src={featuredMovie.trailer}
            autoPlay
            muted
            loop
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              top: "0",
              left: "0",
            }}
          ></video>
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              background: "linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.9))",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "40px",
            }}
          >
            <h1 style={{ fontSize: "80px", fontWeight: "bold", marginBottom: "20px", textAlign: "left" }}>
              {featuredMovie.title}
            </h1>
            <p style={{ fontSize: "25px", maxWidth: "600px", marginBottom: "20px" }}>
              {featuredMovie.description}
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                style={{
                  backgroundColor: "#e50914",
                  border: "none",
                  padding: "10px 20px",
                  fontSize: "16px",
                  color: "white",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Play
              </button>
              <button
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  border: "1px solid white",
                  padding: "10px 20px",
                  fontSize: "16px",
                  color: "white",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                My List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Rows */}
      {Object.entries(categories).map(([categoryName, categoryMovies]) => (
        <div className="movie-row" style={{ padding: "20px" }} key={categoryName}>
          <h2 style={{ marginBottom: "3px", textAlign: "left" }}>{categoryName}</h2>
          <div
            className="movie-thumbnails"
            style={{ display: "flex", gap: "20px", overflowX: "auto" }}
          >
            {categoryMovies.map((movie) => (
              <div
                key={movie.id}
                className="movie-container"
                style={{ position: "relative", cursor: "pointer" }}
                onMouseEnter={() => setHoveredMovie(movie.id)}
                onMouseLeave={() => setHoveredMovie(null)}
              >
                <img
                  src={movie.img}
                  alt={movie.title}
                  style={{
                    width: "150px",
                    height: "225px",
                    objectFit: "cover",
                    borderRadius: "5px",
                    transition: "transform 0.3s",
                    transform: hoveredMovie === movie.id ? "scale(1.1)" : "scale(1)",
                  }}
                />
                {hoveredMovie === movie.id && (
                  <div
                    className="movie-hover"
                    style={{
                      position: "absolute",
                      top: "-100px",
                      left: "0",
                      width: "300px",
                      height: "400px",
                      backgroundColor: "#1c1c1c",
                      borderRadius: "10px",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      zIndex: 20,
                      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.8)",
                      animation: "fadeIn 0.3s ease-in-out",
                    }}
                  >
                    <video
                      src={movie.trailer}
                      autoPlay
                      muted
                      preload="auto"
                      loop
                      style={{
                        width: "100%",
                        height: "60%",
                        objectFit: "cover",
                      }}
                    ></video>
                    <div className="info" style={{ padding: "10px", textAlign: "center" }}>
                      <h3 style={{ marginBottom: "10px", color: "white" }}>{movie.title}</h3>
                      <button
                        style={{
                          backgroundColor: "#e50914",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          padding: "10px 20px",
                          fontSize: "16px",
                          cursor: "pointer",
                        }}
                      >
                        Watch Full Movie
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
