import "./MovieInfo.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import Recommendations from "../../Utils/Recommendations/Recommendations";
import VideoPlayer from "../../Utils/VideoPlayer/VideoPlayer";
import { backendPort } from "../../config";

function MovieInfo({ id }) {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    async function fetchMovie() {
      const response = await fetch(`http://localhost:${backendPort}/api/movies/${id}`);
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
        <section className="recommendations">
          <h2>Movies for you:</h2>
          <Recommendations id={id} />
        </section>
      </div>
    );
  }

  const { title, categories, lengthMinutes, releaseYear, description, cast } = movie;

  return (
    <div className="movie-info">
      <div className="movie-trailer">
        <VideoPlayer movieId={id} type="trailer" />
      </div>
      <section className="movie-details">
        <section className="info-header">
          <h1>{title}</h1>
          <Link target="_parent" to={`/movies/${id}/watch`}>
            <button
              className="btn btn-light play-btn-main"
              type="button"
              aria-label="Play" >
              ▶ Play Movie
            </button>
          </Link>
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