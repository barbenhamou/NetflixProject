import "./MovieCard.css";

function MovieCard({ title, categories, lengthMinutes, releaseYear, description, image }) {
    return (
        <div className="movie-card">
            <div className="image-container">
                <img src={image} alt={title} />
                <div className="play-button" onClick={''}>▶</div>
            </div>
            <h3>{title}</h3>
            <p>{releaseYear} | {Math.floor(lengthMinutes / 60)}h {lengthMinutes % 60}m</p>
            <p>{categories.join(' • ')}</p>
            <p>{description}</p>
        </div>
    );
}

export default MovieCard;