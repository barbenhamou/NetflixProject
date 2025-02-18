import "./MovieCard.css";
import { backendUrl } from "../../config";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InfoButton from "../InfoButton/InfoButton";

function MovieCard({ id, title, categories, lengthMinutes, releaseYear, description, showInfo, infoButton }) {
    const [imageSrc, setImageSrc] = useState("");

    useEffect(() => {
        const fetchImage = async () => {
            const response = await fetch(`${backendUrl}contents/movies/${id}?type=image`);

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setImageSrc(imageUrl);
        };

        fetchImage();
    }, [id]);

    return (
        <div className="card movie-card">
            <div className="image-container">
                <img
                    alt={title}
                    className="card-img-top"
                    src={imageSrc}
                />
                <Link target="_parent" to={`/movies/${id}/watch`} >
                    <i className="bi bi-play-circle play-btn" />
                </Link>
            </div>
            <div className="card-body">
                <section className="title-container">
                    <h5 className="card-title">{title}</h5>
                    {infoButton && <InfoButton id={id} />}
                </section>
                {showInfo && <p className="card-text">
                    {releaseYear} | {Math.floor(lengthMinutes / 60)}h {lengthMinutes % 60}m
                </p>}
                {showInfo && <p className="card-text">{categories.join(' • ')}</p>}
                {showInfo && <p className="card-text description">{description}</p>}
            </div>
        </div>
    );
}

export default MovieCard;