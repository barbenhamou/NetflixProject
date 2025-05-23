import React, { useState, useEffect, useMemo } from "react";
import { backendUrl } from "../../config";
import { Link } from "react-router-dom";
import "./Admin.css";

const AdminPanel = () => {
    const [action, setAction] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [categories, setCategories] = useState([]);
    const [movies, setMovies] = useState([]);
    const [message, setMessage] = useState("");

    const authToken = useMemo(() => localStorage.getItem("authToken"), []);
    const headers = useMemo(() => {
        return {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
        };
    }, [authToken]);

    // Fetch categories & movies on load
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${backendUrl}categories`, { headers });
                if (!res.ok) throw new Error("Failed to fetch categories");
                setCategories(await res.json());
            } catch (error) {
                console.error(error);
            }
        };

        const fetchMovies = async () => {
            try {
                const res = await fetch(`${backendUrl}movies`, { headers });
                if (!res.ok) throw new Error("Failed to fetch movies");
                const data = await res.json();
                setMovies(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchCategories();
        fetchMovies();
    }, [headers]);

    async function uploadFilesForMovie(movieId, imageFile, trailerFile, filmFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("trailer", trailerFile);
        formData.append("film", filmFile);

        formData.append("imageType", "image");
        formData.append("imageName", imageFile.name);
        formData.append("trailerType", "trailer");
        formData.append("trailerName", trailerFile.name);
        formData.append("filmType", "film");
        formData.append("filmName", filmFile.name);

        await fetch(`${backendUrl}contents/movies/${movieId}`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${localStorage.getItem("authToken")}` },
            body: formData
        });
    }


    // Handle input change
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({ ...formData, [name]: files ? files[0] : value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;

            switch (action) {
                case "add-category":
                    if (categories.some((cat) => cat.name === formData.name)) {
                        setMessage("Category already exists.");
                        return;
                    }

                    response = await fetch(`${backendUrl}categories`, {
                        method: "POST",
                        headers,
                        body: JSON.stringify({
                            name: formData.name,
                            promoted: formData.promoted || false, // send boolean from the checkbox
                        }),
                    });
                    break;

                case "delete-category":
                    const categoryToDelete = categories.find((cat) => cat.name === formData.name);
                    if (!categoryToDelete) {
                        setMessage("Category does not exist.");
                        return;
                    }
                    response = await fetch(`${backendUrl}categories/${categoryToDelete.id}`, {
                        method: "DELETE",
                        headers,
                    });
                    break;

                case "edit-category":
                    const oldCategory = categories.find((cat) => cat.name === formData.oldName);
                    if (!oldCategory) {
                        setMessage("Old category does not exist.");
                        return;
                    }
                    if (categories.some((cat) => cat.name === formData.newName)) {
                        setMessage("New category name already exists.");
                        return;
                    }
                    response = await fetch(`${backendUrl}categories/${oldCategory.id}`, {
                        method: "PATCH",
                        headers,
                        body: JSON.stringify({ name: formData.newName }),
                    });
                    break;
                case "delete-movie":
                    const movieId = formData.id;

                    if (!movieId) {
                        setMessage("Please enter a valid Movie ID");
                        return;
                    }

                    response = await fetch(`${backendUrl}movies/${movieId}`, {
                        method: "DELETE",
                        headers
                    });
                    break;
                case "add-movie": {
                    try {
                        // Convert the category and cast input string into an array of trimmed strings.
                        let categoriesArray = [];
                        if (formData.Category) {
                            if (formData.Category.includes(",")) {
                                categoriesArray = formData.Category
                                    .split(",")
                                    .map((cat) => cat.trim())
                                    .filter((cat) => cat.length > 0);
                            } else {
                                // When only one category is entered
                                const trimmedCategory = formData.Category.trim();
                                if (trimmedCategory !== "") {
                                    categoriesArray = [trimmedCategory];
                                }
                            }
                        }

                        let castArray = [];
                        if (formData.cast) {
                            if (formData.cast.includes(",")) {
                                castArray = formData.cast
                                    .split(",")
                                    .map((cast) => cast.trim())
                                    .filter((cast) => cast.length > 0);
                            } else {
                                // When only one cast is entered
                                const trimmedCast = formData.cast.trim();
                                if (trimmedCast !== "") {
                                    castArray = [trimmedCast];
                                }
                            }
                        }

                        // Ensure optional fields are only added if they have values
                        const payload = {
                            title: formData.title,
                            cast: castArray,
                            lengthMinutes: formData.lengthMinutes,
                            categories: categoriesArray,
                            image: formData.image.name, // Required
                            trailer: formData.trailer.name, // Required
                            film: formData.film.name, // Required
                            ...(formData.releaseYear && { releaseYear: formData.releaseYear }),
                            ...(formData.categories?.length > 0 && { categories: formData.categories }),
                            ...(formData.cast?.length > 0 && { cast: formData.cast }),
                            ...(formData.description && { description: formData.description }),
                        };
                        const response = await fetch(`${backendUrl}movies`, {
                            method: "POST",
                            headers,
                            body: JSON.stringify(payload),
                        });
                        // Extract the Location header
                        const location = response.headers.get("Location");
                        if (!location) {
                            throw new Error("Error: Missing Location header in response.");
                        }

                        // Extract the movie ID from the Location URL
                        const newMovieId = location.split("/").pop();
                        uploadFilesForMovie(newMovieId, formData.image, formData.trailer, formData.film);
                        setMessage(`Movie created! ID: ${newMovieId}`);
                    } catch (err) {
                        console.error(err);
                        setMessage(err.message || "An error occurred while adding the movie.");
                    }
                    break;
                }
                case "edit-movie": {
                    try {
                        // Convert the category input string into an array of trimmed strings.
                        let categoriesArray = [];
                        if (formData.Category) {
                            if (formData.Category.includes(",")) {
                                categoriesArray = formData.Category
                                    .split(",")
                                    .map((cat) => cat.trim())
                                    .filter((cat) => cat.length > 0);
                            } else {
                                // When only one category is entered
                                const trimmedCategory = formData.Category.trim();
                                if (trimmedCategory !== "") {
                                    categoriesArray = [trimmedCategory];
                                }
                            }
                        }

                        let castArray = [];
                        if (formData.cast) {
                            if (formData.cast.includes(",")) {
                                castArray = formData.cast
                                    .split(",")
                                    .map((cast) => cast.trim())
                                    .filter((cast) => cast.length > 0);
                            } else {
                                // When only one cast is entered
                                const trimmedCast = formData.cast.trim();
                                if (trimmedCast !== "") {
                                    castArray = [trimmedCast];
                                }
                            }
                        }

                        // Prepare the payload for the PUT request
                        const payload = {
                            id: formData.oldid,
                            title: formData.newTitle, // Updated to match the input field name
                            cast: castArray,
                            lengthMinutes: formData.lengthMinutes,
                            categories: categoriesArray,
                            image: formData.image.name, // Required
                            trailer: formData.trailer.name, // Required
                            film: formData.film.name, // Required
                            ...(formData.releaseYear && { releaseYear: formData.releaseYear }),
                            ...(formData.description && { description: formData.description }),
                        };

                        // Corrected fetch call with the proper URL format
                        const response = await fetch(`${backendUrl}movies/${formData.oldid}`, {
                            method: "PUT",
                            headers,
                            body: JSON.stringify(payload),
                        });

                        // Extract the Location header
                        const location = response.headers.get("Location");
                        if (!location) {
                            throw new Error("Error: Missing Location header in response.");
                        }

                        // Extract the movie ID from the Location URL
                        const newMovieId = location.split("/").pop();
                        uploadFilesForMovie(newMovieId, formData.image, formData.trailer, formData.film);
                        setMessage(`Movie updated! ID: ${newMovieId} and files saved locally.`);
                    } catch (err) {
                        console.error(err);
                        setMessage(err.message || "An error occurred while editing the movie.");
                    }
                    break;
                }
            }

            setMessage("Action completed successfully!");
            setTimeout(() => {
                window.location.reload();
            }, 1000); // Add a short delay
        } catch (error) {
            setMessage(error.message);
        }
    };
    return (
        <div className="center form-container">
            <Link to='/'>
                <i className="bi bi-house-door"></i>
            </Link>
            {/* White rectangle containing everything */}
            <div className="form">
                <h3>Admin Panel</h3>

                <form onSubmit={handleSubmit}>
                    {/* Styled Dropdown */}
                    <div className="custom-dropdown">
                        <button
                            type="button"
                            className="dropdown-button"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            {action ? action.replace("-", " ") : "Select Action"} ▼
                        </button>

                        {/* Dropdown Options */}
                        {dropdownOpen && (
                            <div className="dropdown-options">
                                {[
                                    "add-category",
                                    "delete-category",
                                    "add-movie",
                                    "delete-movie",
                                    "edit-category",
                                    "edit-movie",
                                ].map((item) => (
                                    <button
                                        key={item}
                                        className="dropdown-item"
                                        onClick={() => {
                                            setAction(item);
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        {item.replace("-", " ")}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Conditional Inputs */}
                    {(action === "delete-category") && (
                        <div className="form-group">
                            <input
                                type="text"
                                name="name"
                                placeholder="Category Name"
                                onChange={handleChange}
                                required
                                className="form-control"
                            />
                        </div>
                    )}

                    {action === "add-category" && (
                        <>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Category Name"
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                />
                            </div>

                            {/* Promoted Checkbox */}
                            <div className="form-group checkbox-group">
                                <input
                                    type="checkbox"
                                    id="promotedCheckbox"
                                    name="promoted"
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            promoted: e.target.checked, // true if checked, false if not
                                        }))
                                    }
                                />
                                <label htmlFor="promotedCheckbox" className="black-text">
                                    Promoted (Yes/No)
                                </label>
                            </div>
                        </>
                    )}
                    {action === "add-movie" && (
                        <>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Movie Title"
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="number"
                                    name="lengthMinutes"
                                    placeholder="Length (Minutes)"
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="cast"
                                    placeholder="Cast"
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="number"
                                    name="releaseYear"
                                    placeholder="Release Year"
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <textarea
                                    name="description"
                                    placeholder="Description"
                                    onChange={handleChange}
                                    className="form-control"
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="Category"
                                    placeholder="Category (for multiple, separate with commas)"
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group file-inputs">
                                <label className="custom-file-label">
                                    Choose Image
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleChange}
                                        required
                                        className="hidden-input"
                                    />
                                </label>
                                <label className="custom-file-label">
                                    Choose Trailer
                                    <input
                                        type="file"
                                        name="trailer"
                                        accept="video/*"
                                        onChange={handleChange}
                                        required
                                        className="hidden-input"
                                    />
                                </label>
                                <label className="custom-file-label">
                                    Choose Movie
                                    <input
                                        type="file"
                                        name="film"
                                        accept="video/*"
                                        onChange={handleChange}
                                        required
                                        className="hidden-input"
                                    />
                                </label>
                            </div>
                        </>
                    )}
                    {action === "delete-movie" && (
                        <div className="form-group">
                            <input
                                type="text"
                                name="id"
                                placeholder="Movie ID"
                                onChange={handleChange}
                                required
                                className="form-control"
                            />
                        </div>
                    )}

                    {action === "edit-category" && (
                        <>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="oldName"
                                    placeholder="Old Category Name"
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="newName"
                                    placeholder="New Category Name"
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                />
                            </div>
                        </>
                    )}

                    {action === "edit-movie" && (
                        <>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="oldid"
                                    placeholder="Old Movie ID"
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="cast"
                                    placeholder="Cast"
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="Category"
                                    placeholder="Categories"
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="newTitle"
                                    placeholder="New Movie Title"
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="lengthMinutes"
                                    placeholder="Length (Minutes)"
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="number"
                                    name="releaseYear"
                                    placeholder="Release Year"
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <textarea
                                    name="description"
                                    placeholder="Description"
                                    onChange={handleChange}
                                    className="form-control"
                                ></textarea>
                            </div>
                            <div className="form-group file-inputs">
                                <label className="custom-file-label">
                                    Choose Image
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleChange}
                                        required
                                        className="hidden-input"
                                    />
                                </label>
                                <label className="custom-file-label">
                                    Choose Trailer
                                    <input
                                        type="file"
                                        name="trailer"
                                        accept="video/*"
                                        onChange={handleChange}
                                        required
                                        className="hidden-input"
                                    />
                                </label>
                                <label className="custom-file-label">
                                    Choose Movie
                                    <input
                                        type="file"
                                        name="film"
                                        accept="video/*"
                                        onChange={handleChange}
                                        required
                                        className="hidden-input"
                                    />
                                </label>
                            </div>
                        </>
                    )}

                    {/* Submit Button */}
                    <button type="submit" className="btn-danger">
                        Submit
                    </button>
                </form>

                {/* Message Display */}
                {message && <p className="alert-message">{message}</p>}
            </div>
        </div>
    );
};

export default AdminPanel;