import "./MovieCard.css";
import { backendPort } from "../config";

function MovieCard({ id, title, categories, lengthMinutes, releaseYear, description, showDescription, infoButton }) {
    return (
        <div className="card movie-card">
            <div className="image-container">
                <img
                    alt={title}
                    className="card-img-top"
                    src={`http://localhost:${backendPort}/api/movies/${id}/files?type=image`}
                />
                <i
                        className="bi bi-play-circle play-btn"
                    onClick={() => window.location.href = `/api/movies/${id}/watch`}></i>
            </div>
            <div className="card-body">
                <section className="title-container">
                    <h5 className="card-title">{title}</h5>
                    {infoButton &&
                        <i
                            className="bi bi-info-circle info-btn"
                            onClick={() => window.location.href = `/api/movies/${id}/info`}></i>
                    }
                </section>
                <p className="card-text">
                    {releaseYear} | {Math.floor(lengthMinutes / 60)}h {lengthMinutes % 60}m
                </p>
                <p className="card-text">{categories.join(' • ')}</p>
                <p className="card-text description">{showDescription ? description : ''}</p>
            </div>
        </div>
    );
}

export default MovieCard;
