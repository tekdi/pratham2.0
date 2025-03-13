import React, { useState } from 'react';
import './CustomModal.css';

interface ConfirmationModalProps {
  handleAction?: () => void;
  handleCloseModal: () => void;
  modalOpen: boolean;
}

const CustomModal: React.FC<ConfirmationModalProps> = ({
  modalOpen,
  handleAction,
  handleCloseModal,
}) => {
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {modalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <h4 className="modal-text">Are you sure to submit the form? </h4>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleAction}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomModal;
