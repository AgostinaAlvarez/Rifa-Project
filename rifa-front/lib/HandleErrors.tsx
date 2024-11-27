import {Icons} from '@/components/Icons/Icons';
import ModalComponent from '@/components/Modals/ModalComponent';
import {ErrorStatus} from './enums/ErrorStatus';

export const handleErrorModal = (
  error: {status: any},
  setCurrentModalContent: (arg0: JSX.Element) => void,
  context?: any,
  children?: any
) => {
  const errorStatus = error.status;
  const errorType =
    Object.values(ErrorStatus).find(
      (status) => status.type === errorStatus && (context ? status.context === context : null)
    ) ||
    Object.values(ErrorStatus).find((status) => status.type === errorStatus) ||
    (ErrorStatus.INTERNAL_SERVER_ERROR as any);
  setCurrentModalContent(
    <ModalComponent>
      <>
        {Icons.ERROR}
        <h3>{errorType.title}</h3>
        <p>{errorType.message}</p>
        {children}
      </>
    </ModalComponent>
  );
};
