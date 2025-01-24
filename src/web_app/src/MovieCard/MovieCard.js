import "./MovieCard.css";

function MovieCard({ id, title, categories, lengthMinutes, releaseYear, description, image }) {
    categories = categories.map((category) => category.name);

    return (
        <div className="card movie-card">
            <div className="image-container">
                <img
                    src={`/Media/MovieImages/${image}`}
                    alt={title}
                    className="card-img-top" />
                <i
                className="bi bi-play-circle play-btn"
                onClick={() => window.location.href = `/api/movies/${id}/watch`}></i>
            </div>
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">
                    {releaseYear} | {Math.floor(lengthMinutes / 60)}h {lengthMinutes % 60}m
                </p>
                <p className="card-text">{categories.join(' • ')}</p>
                <p className="card-text description">{description}</p>
            </div>
        </div>
    );
}

export default MovieCard;
