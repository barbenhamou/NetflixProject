import React, { useState, useEffect } from "react";
import { backendPort } from "../config";
import "./Admin.css";


const AdminPanel = () => {
    const [action, setAction] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [categories, setCategories] = useState([]);
    const [movies, setMovies] = useState([]);
    const [message, setMessage] = useState("");

    const headers = { "Authorization": `Bearer ${localStorage.getItem("authToken")}`, "Content-Type": "application/json" };
    // Fetch categories & movies on load
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`http://localhost:${backendPort}/api/categories`, { headers });
                if (!res.ok) throw new Error("Failed to fetch categories");
                setCategories(await res.json());
            } catch (error) {
                console.error(error);
            }
        };

        const fetchMovies = async () => {
            try {
                const res = await fetch(`http://localhost:${backendPort}/api/movies`, { headers });
                if (!res.ok) throw new Error("Failed to fetch movies");
                const data = await res.json();
                setMovies(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchCategories();
        fetchMovies();
    }, []);

    async function uploadFilesForMovie(movieId, imageFile, trailerFile, filmFile) {
        // Create a new FormData object and append the files
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("trailer", trailerFile);
        formData.append("film", filmFile);

        // (Optional) Append extra fields if needed
        formData.append("imageType", "image");
        formData.append("imageName", imageFile.name);
        formData.append("trailerType", "trailer");
        formData.append("trailerName", trailerFile.name);
        formData.append("filmType", "film");
        formData.append("filmName", filmFile.name);

        // Create a headers object WITHOUT the Content-Type header.
        const fileUploadHeaders = {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            // Note: DO NOT include "Content-Type" here!
        };

        const response = await fetch(`http://localhost:${backendPort}/api/contents/movies/${movieId}`, {
            method: "POST",
            headers: fileUploadHeaders,
            body: formData,
        });

        const data = await response.json();
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

                        setMessage("❌ Category already exists.");
                        return;
                    }
                    response = await fetch(`http://localhost:${backendPort}/api/categories`, {
                        method: "POST",
                        headers,
                        body: JSON.stringify({ name: formData.name, promoted: true }),
                    });
                    break;

                case "delete-category":
                    const categoryToDelete = categories.find((cat) => cat.name === formData.name);
                    if (!categoryToDelete) {
                        setMessage("⚠️ Category does not exist.");
                        return;
                    }
                    response = await fetch(`http://localhost:${backendPort}/api/categories/${categoryToDelete.id}`, {
                        method: "DELETE",
                        headers,
                    });
                    break;

                case "edit-category":
                    const oldCategory = categories.find((cat) => cat.name === formData.oldName);
                    if (!oldCategory) {
                        setMessage("⚠️ Old category does not exist.");
                        return;
                    }
                    if (categories.some((cat) => cat.name === formData.newName)) {
                        setMessage("❌ New category name already exists.");
                        return;
                    }
                    response = await fetch(`http://localhost:${backendPort}/api/categories/${oldCategory.id}`, {
                        method: "PATCH",
                        headers,
                        body: JSON.stringify({ name: formData.newName }),
                    });
                    break;
                case "delete-movie":
                    let movieToDelete = null;

                    // Iterate through each category to find the movie
                    for (const category of movies) {
                        movieToDelete = category.find((movie) => movie.title === formData.title);
                        if (movieToDelete) break;
                    }

                    if (!movieToDelete) {
                        setMessage("⚠️ Movie does not exist");
                        return;
                    }

                    response = await fetch(`http://localhost:${backendPort}/api/movies/${movieToDelete.id}`, {
                        method: "DELETE",
                        headers
                    });
                    break;

                // Updated add-movie case
                case "add-movie": {
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

                        // Ensure optional fields are only added if they have values
                        const payload = {
                            title: formData.title,
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
                        const response = await fetch(`http://localhost:${backendPort}/api/movies`, {
                            method: "POST",
                            headers,
                            body: JSON.stringify(payload),
                        });
                        // Extract the Location header
                        const location = response.headers.get("Location");
                        if (!location) {
                            throw new Error("❌ Error: Missing Location header in response.");
                        }

                        // Extract the movie ID from the Location URL
                        const newMovieId = location.split("/").pop();
                        uploadFilesForMovie(newMovieId, formData.image, formData.trailer, formData.film);
                        setMessage(`✅ Movie created! ID: ${newMovieId} and files saved locally.`);
                    } catch (err) {
                        console.error(err);
                        setMessage(err.message || "❌ An error occurred while adding the movie.");
                    }
                    break;
                }

                case "edit-movie": {
                    const oldMovie = movies.flat().find((movie) => movie.title === formData.oldTitle);
                    if (!oldMovie) {
                        setMessage("⚠️ Old movie does not exist.");
                        return;
                    }
                    if (movies.flat().some((movie) => movie.title === formData.newTitle)) {
                        setMessage("❌ New movie title already exists.");
                        return;
                    }

                    const editMovieFormData = new FormData();
                    Object.keys(formData).forEach((key) => {
                        if (key !== "oldTitle" && key !== "newTitle") {
                            editMovieFormData.append(key, formData[key]);
                        }
                    });
                    editMovieFormData.append("title", formData.newTitle);

                    response = await fetch(`http://localhost:${backendPort}/api/movies/${oldMovie.id}`, {
                        method: "PUT",
                        headers,
                        body: editMovieFormData,
                    });

                    if (response.ok) {
                        // Save files locally after successful response
                        uploadFilesForMovie(oldMovie.id, {
                            image: formData.image,
                            trailer: formData.trailer,
                            film: formData.film,
                        });
                    }
                    break;
                }
            }

            setMessage("✅ Action completed successfully!");
            setTimeout(() => {
                window.location.reload();
            }, 1500); // Add a short delay for better user experience
        } catch (error) {
            setMessage(error.message);
        }
    };


    return (
        <div className="hero-container">
            <div className="hero-overlay"></div>
            <div className="hero-content">

                <h1>Admin Panel</h1>

                <form onSubmit={handleSubmit}>
                    {/* Styled Dropdown */}
                    <div className="custom-dropdown">
                        <button type="button" className="dropdown-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
                            {action ? action.replace("-", " ") : "Select Action"} ▼
                        </button>

                        {/* Dropdown Options */}
                        {dropdownOpen && (
                            <div className="dropdown-options">
                                {["add-category", "delete-category", "add-movie", "delete-movie", "edit-category", "edit-movie"].map((item) => (
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
                    {(action === "add-category" || action === "delete-category") && (
                        <div className="email-form">
                            <input type="text" name="name" placeholder="Category Name" onChange={handleChange} required />
                        </div>
                    )}

                    {action === "add-movie" && (
                        <>
                            <div className="email-form">
                                <input type="text" name="title" placeholder="Movie Title" onChange={handleChange} required />
                            </div>
                            <div className="email-form">
                                <input type="number" name="lengthMinutes" placeholder="Length (Minutes)" onChange={handleChange} required />
                            </div>
                            <div className="email-form">
                                <input type="number" name="releaseYear" placeholder="Release Year" onChange={handleChange} required />
                            </div>
                            <div className="email-form">
                                <textarea name="description" placeholder="Description" onChange={handleChange}></textarea>
                            </div>
                            <div className="email-form">
                                {/* Changed the field name to "Category" so that formData.Category is set */}
                                <input
                                    type="text"
                                    name="Category"
                                    placeholder="Category (for multiple, separate with commas)"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="email-form">
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
                        <div className="email-form">
                            <input type="text" name="title" placeholder="Movie Name" onChange={handleChange} required />
                        </div>
                    )}
                    {action === "edit-category" && (
                        <>
                            <div className="email-form">
                                <input type="text" name="oldName" placeholder="Old Category Name" onChange={handleChange} required />
                            </div>
                            <div className="email-form">
                                <input type="text" name="newName" placeholder="New Category Name" onChange={handleChange} required />
                            </div>
                        </>
                    )}

                    {action === "edit-movie" && (
                        <>
                            <div className="email-form">
                                <input type="text" name="oldTitle" placeholder="Old Movie Title" onChange={handleChange} required />
                            </div>
                            <div className="email-form">
                                <input type="text" name="newTitle" placeholder="New Movie Title" onChange={handleChange} required />
                            </div>
                            <div className="email-form">
                                <input type="text" name="lengthMinutes" placeholder="Length (Minutes)" onChange={handleChange} required />
                            </div>
                            <div className="email-form">
                                <input type="number" name="releaseYear" placeholder="Release Year" onChange={handleChange} required />
                            </div>
                            <div className="email-form">
                                <textarea name="description" placeholder="Description" onChange={handleChange}></textarea>
                            </div>
                            <div className="email-form">
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
                    <div className="email-form button">
                        <button type="submit" className="email-form button">Submit</button>
                    </div>
                </form>

                {/* Message Display */}
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default AdminPanel;