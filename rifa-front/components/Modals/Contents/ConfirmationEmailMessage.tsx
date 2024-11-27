import {useEffect} from 'react';
import {useAppContext} from '@/lib/AppContext';

const ConfirmationEmailMessage = () => {
  const {setCurrentModalContet} = useAppContext();

  useEffect(() => {
    setTimeout(() => {
      setCurrentModalContet(null);
    }, 3000);
  }, []);

  return (
    <>
      <div className="modal-title-container">
        <h2 className="subtitle">¡Email de confirmación enviado!</h2>
      </div>
      <div className="modal-description-paragraph-container">
        <p>No te olvides de revisar tu casilla de mensajes y validar tu email</p>
      </div>
    </>
  );
};

export default ConfirmationEmailMessage;
