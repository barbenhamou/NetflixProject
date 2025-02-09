import "./MovieCard.css";
import { backendPort } from "../../config";
import { useEffect, useState } from "react";

function MovieCard({ id, title, categories, lengthMinutes, releaseYear, description, showDescription, infoButton }) {
    const [imageSrc, setImageSrc] = useState("");

    useEffect(() => {
        const fetchImage = async () => {
            const response = await fetch(`http://localhost:${backendPort}/api/contents/movies/${id}?type=image`);

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setImageSrc(imageUrl);
        };

        fetchImage();
    }, [backendPort, id]);

    return (
        <div className="card movie-card">
            <div className="image-container">
                <img
                    alt={title}
                    className="card-img-top"
                    src={imageSrc}
                />
                <i
                    className="bi bi-play-circle play-btn"
                    onClick={() => window.location.href = `/movies/${id}/watch`}></i>
            </div>
            <div className="card-body">
                <section className="title-container">
                    <h5 className="card-title">{title}</h5>
                    {infoButton &&
                        <i
                            className="bi bi-info-circle info-btn"
                            onClick={() => window.location.href = `/movies/${id}/info`}></i>
                    }
                </section>
                {showDescription && <p className="card-text">
                    {releaseYear} | {Math.floor(lengthMinutes / 60)}h {lengthMinutes % 60}m
                </p>}
                {showDescription && <p className="card-text">{categories.join(' • ')}</p>}
                {showDescription && <p className="card-text description">{description}</p>}
            </div>
        </div>
    );
}

export default MovieCard;