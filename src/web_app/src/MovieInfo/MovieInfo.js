import "./MovieInfo.css";
import { useState, useEffect } from "react";
import Recommendations from "../Recommendations/Recommendations";

function MovieInfo({ id }) {
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
      <div className="movie-info">
        <p>Loading...</p>
        <Recommendations />
      </div>
    );
  }

  const { title, categories, lengthMinutes, releaseYear, description, image, trailer, cast } = movie;

  return (
    <div className="movie-info">
      <div className="image-container">
        <img src={image} alt={title} />
        <button className="play-button">
          Play
        </button>
      </div>
      <h3>{title}</h3>
      <p>
        {releaseYear} | {Math.floor(lengthMinutes / 60)}h {lengthMinutes % 60}m
      </p>
      <p>Genres: {categories.join(", ")}</p>
      <p>Cast: {cast.join(", ")}</p>
      <p>{description}</p>
      <Recommendations />
    </div>
  );
}

export default MovieInfo;
