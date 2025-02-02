import React, { useState, useEffect } from "react";
import "./guest.css"; // Import the CSS file

// Object containing translations for supported languages
const translations = {
  English: {
    headerTitle: "Unlimited movies, TV shows and more.",
    headerSubtitle: "Watch anywhere. Cancel anytime.",
    headerPrompt:
      "Ready to watch? Enter your email to create or restart your membership.",
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
    faqTitle: "Frequently Asked Questions",
    faq1: "What is Netflix?",
    faq2: "How much does Netflix cost?",
    faq3: "Where can I watch?",
    faq4: "How do I cancel?",
    faq5: "What can I watch on Netflix?",
    faq6: "Is Netflix good for kids?",
    footerQuestions: "Questions? call 000-000-000-000",
    footerNetflix: "Netflix India",
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
    faq1: "¿Qué es Netflix?",
    faq2: "¿Cuánto cuesta Netflix?",
    faq3: "¿Dónde puedo mirar?",
    faq4: "¿Cómo cancelo?",
    faq5: "¿Qué puedo ver en Netflix?",
    faq6: "¿Netflix es bueno para niños?",
    footerQuestions: "¿Preguntas? llama al 000-000-000-000",
    footerNetflix: "Netflix España",
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
    faqTitle: "Questions Fréquemment Posées",
    faq1: "Qu'est-ce que Netflix ?",
    faq2: "Combien coûte Netflix ?",
    faq3: "Où puis-je regarder ?",
    faq4: "Comment annuler ?",
    faq5: "Que puis-je regarder sur Netflix ?",
    faq6: "Netflix est-il adapté aux enfants ?",
    footerQuestions: "Des questions ? Appelez le 000-000-000-000",
    footerNetflix: "Netflix France",
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
      ? `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url(${process.env.PUBLIC_URL}/images/header-image.png)`
      : `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${process.env.PUBLIC_URL}/images/header-image.png)`,
  };

  return (
    <div className="home-page">
      {/* Header Section */}
      <div className="header" style={headerStyle}>
        <nav>
          <img
            src={`${process.env.PUBLIC_URL}/images/logo.png`}
            className="logo"
            alt="Logo"
          />
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
            <button className="sign-in-btn">Sign In</button>
          </div>
        </nav>
        <div className="header-content">
          <h1>{t.headerTitle}</h1>
          <h3>{t.headerSubtitle}</h3>
          <p>{t.headerPrompt}</p>
          <form
            className="email-signup"
            onSubmit={(e) => {
              e.preventDefault();
              // Handle email signup submission here…
            }}
          >
            <input type="email" placeholder="Email address" required />
            <button type="submit">Get Started</button>
          </form>
        </div>
      </div>

      {/* Features Section */}
      <div className="features">
        <div className="row">
          <div className="text-col">
            <h2>{t.feature1Title}</h2>
            <p>{t.feature1Text}</p>
          </div>
          <div className="img-col">
            <img
              src={`${process.env.PUBLIC_URL}/images/feature-1.png`}
              alt="Feature 1"
            />
          </div>
        </div>
        <div className="row">
          <div className="img-col">
            <img
              src={`${process.env.PUBLIC_URL}/images/feature-2.png`}
              alt="Feature 2"
            />
          </div>
          <div className="text-col">
            <h2>{t.feature2Title}</h2>
            <p>{t.feature2Text}</p>
          </div>
        </div>
        <div className="row">
          <div className="text-col">
            <h2>{t.feature3Title}</h2>
            <p>{t.feature3Text}</p>
          </div>
          <div className="img-col">
            <img
              src={`${process.env.PUBLIC_URL}/images/feature-3.png`}
              alt="Feature 3"
            />
          </div>
        </div>
        <div className="row">
          <div className="img-col">
            <img
              src={`${process.env.PUBLIC_URL}/images/feature-4.png`}
              alt="Feature 4"
            />
          </div>
          <div className="text-col">
            <h2>{t.feature4Title}</h2>
            <p>{t.feature4Text}</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq">
        <h2>{t.faqTitle}</h2>
        <ul className="accordion">
          <li>
            <input type="radio" name="accordion" id="first" />
            <label htmlFor="first">{t.faq1}</label>
            <div className="content">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                maximus faucibus ligula in cursus. Aenean elementum mauris
                tellus, ullamcorper fringilla justo suscipit ut.
              </p>
            </div>
          </li>
          <li>
            <input type="radio" name="accordion" id="second" />
            <label htmlFor="second">{t.faq2}</label>
            <div className="content">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                maximus faucibus ligula in cursus. Aenean elementum mauris
                tellus, ullamcorper fringilla justo suscipit ut.
              </p>
            </div>
          </li>
          <li>
            <input type="radio" name="accordion" id="third" />
            <label htmlFor="third">{t.faq3}</label>
            <div className="content">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                maximus faucibus ligula in cursus. Aenean elementum mauris
                tellus, ullamcorper fringilla justo suscipit ut.
              </p>
            </div>
          </li>
          <li>
            <input type="radio" name="accordion" id="fourth" />
            <label htmlFor="fourth">{t.faq4}</label>
            <div className="content">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                maximus faucibus ligula in cursus. Aenean elementum mauris
                tellus, ullamcorper fringilla justo suscipit ut.
              </p>
            </div>
          </li>
          <li>
            <input type="radio" name="accordion" id="fifth" />
            <label htmlFor="fifth">{t.faq5}</label>
            <div className="content">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                maximus faucibus ligula in cursus. Aenean elementum mauris
                tellus, ullamcorper fringilla justo suscipit ut.
              </p>
            </div>
          </li>
          <li>
            <input type="radio" name="accordion" id="sixth" />
            <label htmlFor="sixth">{t.faq6}</label>
            <div className="content">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                maximus faucibus ligula in cursus. Aenean elementum mauris
                tellus, ullamcorper fringilla justo suscipit ut.
              </p>
            </div>
          </li>
        </ul>
        <small>{t.headerPrompt}</small>
        <form
          className="email-signup"
          onSubmit={(e) => {
            e.preventDefault();
            // Handle email signup submission here…
          }}
        >
          <input type="email" placeholder="Email address" required />
          <button type="submit">Get Started</button>
        </form>
      </div>

      {/* Footer Section */}
      <div className="footer">
        <h2>{t.footerQuestions}</h2>
        <div className="row">
          <div className="col">
            <a href="#">FAQ</a>
            <a href="#">Investor Relations</a>
            <a href="#">Privacy</a>
            <a href="#">Speed Test</a>
          </div>
          <div className="col">
            <a href="#">Help Center</a>
            <a href="#">Jobs</a>
            <a href="#">Cookies Preferences</a>
            <a href="#">Legal Notices</a>
          </div>
          <div className="col">
            <a href="#">Account</a>
            <a href="#">Ways to watch</a>
            <a href="#">Corporate Information</a>
            <a href="#">Only on Netflix</a>
          </div>
          <div className="col">
            <a href="#">Media Centre</a>
            <a href="#">Terms of Use</a>
            <a href="#">Contact Us</a>
          </div>
        </div>
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
        <p className="copyright-txt">{t.footerNetflix}</p>
      </div>
    </div>
  );
};

export default GuestPage;
