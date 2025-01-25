import React, { useState, useEffect } from "react";

const Home = () => {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [hoveredMovie, setHoveredMovie] = useState(null);

  const movies = [
    {
      id: "movie1",
      title: "Avengers: Endgame",
      img: "https://m.media-amazon.com/images/I/71Sb4AfzGTL._AC_UF894,1000_QL80_.jpg",
      trailer: "/Media/Movies/Marvel Studios' Avengers_ Endgame - Official Trailer.mp4"
    },
    {
      id: "movie2",
      title: "Suits: The Final Season",
      img: "https://i5.walmartimages.com/seo/Avengers-Age-of-Ultron-Marvel-DVD_bf9dddf2-389c-454e-8b32-4d83dd905bcd.b2c494e52ac5d518f088c70b488cf5f9.jpeg",
      trailer: "https://www.w3schools.com/html/movie.mp4", 
    },
  ];

  const featuredMovie = {
    title: "Avengers: Endgame",
    description:
      "In 2018, 23 days after Thanos erased half of all life in the universe,Carol Danvers rescues Tony Stark and Nebula from deep space. Five years later, Scott Lang escapes from the Quantum Realm and helps the Avengers with a plan to undo the Snap.",
    trailer: "/Media/Movies/Marvel Studios' Avengers_ Endgame - Official Trailer.mp4",
  };

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

  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "white", backgroundColor: "#141414" }}>
      {/* Header Section */}
      <header
        style={{
          display: "flex",
          alignItems: "left",
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
        <nav style={{ marginLeft: "30px", display: "flex", gap: "15px" }}>
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
      </header>

      {/* Featured Movie Section */}
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
          <h1 style={{ fontSize: "80px", fontWeight: "bold", marginBottom: "20px",textAlign: "left" }}>
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

      {/* Movie Row Section */}
      <div className="movie-row" style={{ padding: "20px" }}>
        <h2 style={{ marginBottom: "3px" ,textAlign: "left"}}>Top Picks For You</h2>
        <div className="movie-thumbnails" style={{ display: "flex", gap: "20px", overflowX: "auto" }}>
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="movie-container"
              style={{
                position: "relative",
                cursor: "pointer",
              }}
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
                    display: "block",
                    zIndex: 20,
                    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.8)",
                    animation: "fadeIn 0.3s ease-in-out",
                  }}
                >
                  <video
                    src={movie.trailer}
                    autoPlay
                    muted
                    loop
                    style={{
                      width: "100%",
                      height: "60%",
                      objectFit: "cover",
                    }}
                  ></video>
                  <div className="info" style={{ padding: "10px" }}>
                    <h3 style={{ marginBottom: "10px" }}>{movie.title}</h3>
                    <p style={{ marginBottom: "10px", fontSize: "14px", color: "#ddd" }}>
                      {movie.description}
                    </p>
                    <button
                      style={{
                        backgroundColor: "#e50914",
                        border: "none",
                        padding: "10px 15px",
                        fontSize: "14px",
                        color: "white",
                        cursor: "pointer",
                        borderRadius: "5px",
                      }}
                    >
                      Watch Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;