import React from 'react';

const ErrorMessageModal = ({title, paragraph}: any) => {
  return (
    <>
      <div className="modal-title-container">
        <h2 className="subtitle">{title}</h2>
      </div>
      <div className="modal-description-paragraph-container">
        <p>{paragraph}</p>
      </div>
    </>
  );
};

export default ErrorMessageModal;
