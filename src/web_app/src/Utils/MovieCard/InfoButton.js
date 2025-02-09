import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./InfoButton.css";

function InfoButton({ id }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Assuming your movie info page is `/movies/:id/info`
    const movieInfoUrl = `/movies/${id}/info`;

    return (
        <>
            <button className="info-button" onClick={openModal}>
                <i className="bi bi-info-circle"></i> Info
            </button>
            {isModalOpen &&
                ReactDOM.createPortal(
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="close-button" onClick={closeModal}>
                                &times;
                            </button>
                            {/* Use an iframe to display the existing page */}
                            <iframe
                                src={movieInfoUrl}
                                title="Movie Info"
                                className="modal-iframe"
                                frameBorder="0"
                            ></iframe>
                        </div>
                    </div>,
                    document.body // Render the modal into the body of the document
                )}
        </>
    );
}

export default InfoButton;
