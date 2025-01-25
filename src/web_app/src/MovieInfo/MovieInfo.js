import "./MovieInfo.css";
import { useState, useEffect } from "react";
import Recommendations from "../Recommendations/Recommendations";
import VideoPlayer from "../VideoPlayer/VideoPlayer";

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
        <Recommendations id={id} />
      </div>
    );
  }

  const { title, categories, lengthMinutes, releaseYear, description, image, trailer, cast } = movie;

  return (
    <div className="movie-info">
      <div className="movie-trailer">
        <VideoPlayer video={trailer} folder={"MovieTrailers"} />
      </div>
      <section className="movie-details">
        <section className="info-header">
          <h1>{title}</h1>
          <button
            className="btn btn-light play-btn-main"
            type="button"
            aria-label="Play"
            onClick={() => window.location.href = `/api/movies/${id}/watch`}>
            ▶ Play Movie
          </button>
        </section>
        <p>
          {releaseYear} | {Math.floor(lengthMinutes / 60)}h {lengthMinutes % 60}m
        </p>
        <p>Genres: {categories.join(", ")}</p>
        <p>Cast: {cast.join(", ")}</p>
        <p>{description}</p>
      </section>
      <section className="recommendations">
        <h2>Movies for you, based on "{title}":</h2>
        <Recommendations id={id} />
      </section>
    </div>
  );
}

export default MovieInfo;
