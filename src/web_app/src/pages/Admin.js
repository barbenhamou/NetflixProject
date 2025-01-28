import React, { useState } from "react";
import "./Admin.css";

const AdminPanel = () => {
  const [action, setAction] = useState(""); 
  const [dropdownOpen, setDropdownOpen] = useState(false); // Fixed dropdown state
  const [formData, setFormData] = useState({});
  const [categories, setCategories] = useState([]);
  const [movies, setMovies] = useState([]);
  const [message, setMessage] = useState("");

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = "67968dcde28b283216601ce0";
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    try {
      let response;
      switch (action) {
        case "add-category":
          if (categories.some((cat) => cat.name === formData.name)) {
            setMessage("Category already exists");
            return;
          }
          response = await fetch("http://localhost:3001/api/categories", {
            method: "POST",
            headers,
            body: JSON.stringify({ name: formData.name, promoted: true }),
          });
          break;

        case "delete-category":
          const categoryToDelete = categories.find((cat) => cat.name === formData.name);
          if (!categoryToDelete) {
            setMessage("Category does not exist");
            return;
          }
          response = await fetch(`http://localhost:3001/api/categories/${categoryToDelete._id}`, {
            method: "DELETE",
            headers,
          });
          break;

        case "add-movie":
          const movieFormData = new FormData();
          movieFormData.append("title", formData.title);
          movieFormData.append("categories", formData.categories);
          movieFormData.append("lengthMinutes", formData.lengthMinutes);
          movieFormData.append("releaseYear", formData.releaseYear);
          movieFormData.append("cast", formData.cast);
          movieFormData.append("description", formData.description);
          movieFormData.append("image", formData.image);
          movieFormData.append("trailer", formData.trailer);
          movieFormData.append("film", formData.film);

          response = await fetch("http://localhost:3001/api/movies", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: movieFormData,
          });
          break;

        case "delete-movie":
          const movieToDelete = movies.find((movie) => movie.title === formData.title);
          if (!movieToDelete) {
            setMessage("Movie does not exist");
            return;
          }
          response = await fetch(`http://localhost:3001/api/movies/${movieToDelete._id}`, {
            method: "DELETE",
            headers,
          });
          break;

        default:
          break;
      }

      if (response && !response.ok) throw new Error(`Failed to perform action: ${response.status}`);
      setMessage("Action completed successfully!");
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
                {["add-category", "delete-category", "add-movie", "delete-movie"].map((item) => (
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
          {action === "add-category" || action === "delete-category" ? (
            <div className="input-field">
              <input type="text" name="name" placeholder="Category Name" onChange={handleChange} required />
            </div>
          ) : null}

          {action === "add-movie" ? (
            <>
              <div className="input-field">
                <input type="text" name="title" placeholder="Movie Title" onChange={handleChange} required />
              </div>
              <div className="input-field">
                <input type="number" name="lengthMinutes" placeholder="Length (Minutes)" onChange={handleChange} required />
              </div>
              <div className="input-field">
                <input type="number" name="releaseYear" placeholder="Release Year" onChange={handleChange} required />
              </div>
              <div className="input-field">
                <textarea name="description" placeholder="Description" onChange={handleChange}></textarea>
              </div>
              <div className="input-field">
                <input type="file" name="image" onChange={handleChange} required />
                <input type="file" name="trailer" onChange={handleChange} required />
                <input type="file" name="film" onChange={handleChange} required />
              </div>
            </>
          ) : null}

          {action === "delete-movie" ? (
            <div className="input-field">
              <input type="text" name="title" placeholder="Movie Name" onChange={handleChange} required />
            </div>
          ) : null}

          {/* Submit Button */}
          <div className="input-field">
            <button type="submit" className="submit-button">Submit</button>
          </div>
        </form>

        {/* Message Display */}
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default AdminPanel;
