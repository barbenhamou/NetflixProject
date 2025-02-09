import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./InfoButton.css";

function InfoButton({ id }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <i className="bi bi-info-circle info-btn" onClick={openModal} />
            {isModalOpen &&
                ReactDOM.createPortal(
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <i className="bi bi-x-lg close-btn" onClick={closeModal}></i>
                            <iframe
                                src={`/movies/${id}/info`}
                                title="Movie Info"
                                className="modal-iframe"
                            ></iframe>
                        </div>
                    </div>,
                    document.body // Render the modal into the body of the document
                )}
        </>
    );
}

export default InfoButton;
