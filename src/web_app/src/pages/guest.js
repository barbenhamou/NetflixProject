import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import "./guest.css"; // Import the CSS file

// Object containing translations for supported languages
const translations = {
  English: {
    headerTitle: "Unlimited movies, TV shows and more.",
    headerSubtitle: "Watch anywhere. Cancel anytime.",
    headerPrompt:
      "Ready to watch?  Click here to create your membership.",
    feature1Title: "Enjoy on your TV.",
    feature1Text:
      "Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players and more.",
    feature2Title: "Download your shows to watch offline.",
    feature2Text:
      "Save your favourites easily and always have something to watch.",
    feature3Title: "Watch everywhere.",
    feature3Text:
      "Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.",
    feature4Title: "Create profiles for children.",
    feature4Text:
      "Send children on adventures with their favourite characters in a space made just for them—free with your membership.",
  },
  Spanish: {
    headerTitle: "Películas, series y más, ilimitado.",
    headerSubtitle: "Mira donde sea. Cancela en cualquier momento.",
    headerPrompt:
      "¿Listo para mirar? Ingresa tu correo para crear o reiniciar tu membresía.",
    feature1Title: "Disfruta en tu TV.",
    feature1Text:
      "Mira en televisores inteligentes, PlayStation, Xbox, Chromecast, Apple TV, reproductores Blu-ray y más.",
    feature2Title: "Descarga tus programas para ver sin conexión.",
    feature2Text:
      "Guarda tus favoritos fácilmente y siempre ten algo para mirar.",
    feature3Title: "Mira en todas partes.",
    feature3Text:
      "Transmite películas y series ilimitadas en tu teléfono, tablet, laptop y TV.",
    feature4Title: "Crea perfiles para niños.",
    feature4Text:
      "Envía a los niños a aventuras con sus personajes favoritos en un espacio creado solo para ellos, incluido gratis en tu membresía.",
    faqTitle: "Preguntas Frecuentes",
  },
  French: {
    headerTitle: "Films, séries TV et bien plus, en illimité.",
    headerSubtitle: "Regardez partout. Annulez à tout moment.",
    headerPrompt:
      "Prêt à regarder ? Entrez votre email pour créer ou redémarrer votre abonnement.",
    feature1Title: "Profitez sur votre TV.",
    feature1Text:
      "Regardez sur les téléviseurs intelligents, PlayStation, Xbox, Chromecast, Apple TV, lecteurs Blu-ray et plus.",
    feature2Title: "Téléchargez vos programmes pour les regarder hors ligne.",
    feature2Text:
      "Enregistrez vos favoris facilement et ayez toujours quelque chose à regarder.",
    feature3Title: "Regardez partout.",
    feature3Text:
      "Diffusez des films et des séries TV illimités sur votre téléphone, tablette, ordinateur portable et TV.",
    feature4Title: "Créez des profils pour enfants.",
    feature4Text:
      "Envoyez les enfants à l'aventure avec leurs personnages préférés dans un espace créé juste pour eux, gratuit avec votre abonnement.",
  },
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
  // Using process.env.PUBLIC_URL ensures the image is loaded from the public folder.
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
            <button type="submit" className="email-signup">Get Started</button>
          </Link>
        </div>
      </div>



    </div>
  );
};

export default GuestPage;
