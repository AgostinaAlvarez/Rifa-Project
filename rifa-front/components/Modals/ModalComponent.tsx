import {IoClose} from 'react-icons/io5';
import {useAppContext} from '@/lib/AppContext';

const ModalComponent = ({children}: any) => {
  const {setCurrentModalContet} = useAppContext();
  const CloseModal = () => {
    setCurrentModalContet(null);
  };
  return (
    <div className="overlay">
      <div className="modal">
        <div className="modal-close-icon-container">
          <IoClose onClick={CloseModal} className="modal-close-icon" />
        </div>
        {children}
      </div>
    </div>
  );
};

export default ModalComponent;
