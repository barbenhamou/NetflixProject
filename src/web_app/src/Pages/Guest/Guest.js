import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import "./Guest.css";

// Object containing translations for supported languages
const translations = {
  English: {
    headerTitle: "Unlimited movies, TV shows and more.",
    headerSubtitle: "Watch anywhere. Cancel anytime.",
    headerPrompt:
      "Ready to watch?  Click here to create your membership.",
  },
  Spanish: {
    headerTitle: "Películas, series y más, ilimitado.",
    headerSubtitle: "Mira donde sea. Cancela en cualquier momento.",
    headerPrompt:
      "¿Listo para mirar? Ingresa tu correo para crear o reiniciar tu membresía.",
  },
  French: {
    headerTitle: "Films, séries TV et bien plus, en illimité.",
    headerSubtitle: "Regardez partout. Annulez à tout moment.",
    headerPrompt:
      "Prêt à regarder ? Entrez votre email pour créer ou redémarrer votre abonnement.",
  }
};

const GuestPage = () => {
  // State for language selection and dropdown toggle
  const [language, setLanguage] = useState("English");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // State for theme toggling (light mode vs. dark mode)
  const [isLightMode, setIsLightMode] = useState(false);

  // Update the document body class based on the theme state
  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
  }, [isLightMode]);

  // Handler for toggling theme
  const toggleTheme = () => {
    setIsLightMode((prevMode) => !prevMode);
  };

  // Handler for selecting a language
  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setDropdownOpen(false);
  };

  // Retrieve the translation strings for the currently selected language
  const t = translations[language];

  // Define inline style for the header background image.
  const headerStyle = {
    backgroundImage: isLightMode
      ? `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)))`
      : `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)))`,
  };

  return (
    <div className="home-page">
      {/* Header Section */}
      <div className="header" style={headerStyle}>
        <nav>
          <span className="logo-text">Nexflit</span>
          <div className="nav-right">
            <div className="dropdown">
              <button
                className="language-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {language}{" "}
                <img
                  src={`${process.env.PUBLIC_URL}/images/down-icon.png`}
                  alt="Dropdown"
                />
              </button>
              {dropdownOpen && (
                <div className="dropdown-content">
                  <a
                    href="#"
                    className="language-option"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLanguageSelect("English");
                    }}
                  >
                    English
                  </a>
                  <a
                    href="#"
                    className="language-option"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLanguageSelect("Spanish");
                    }}
                  >
                    Spanish
                  </a>
                  <a
                    href="#"
                    className="language-option"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLanguageSelect("French");
                    }}
                  >
                    French
                  </a>
                </div>
              )}
            </div>
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {isLightMode ? "Dark Mode" : "Light Mode"}
            </button>
            <Link to="/login">
              <button className="sign-in-btn">Login</button>
            </Link>
          </div>
        </nav>
        <div className="header-content">
          <h1>{t.headerTitle}</h1>
          <h3>{t.headerSubtitle}</h3>
          <p>{t.headerPrompt}</p>
          <Link to="/signup">
            <button type="submit" className="get-started">Get Started</button>
          </Link>
        </div>
      </div>



    </div>
  );
};

export default GuestPage;
