import React from 'react';

const ErrorPayment = () => {
  return (
    <>
      <div className="modal-title-container">
        <h2 className="subtitle">¡Algo salió mal!</h2>
      </div>
      <div className="modal-description-paragraph-container">
        <p>No pudimos procesar tu pago... Vuelve a intentarlo más tarde.</p>
      </div>
    </>
  );
};

export default ErrorPayment;
