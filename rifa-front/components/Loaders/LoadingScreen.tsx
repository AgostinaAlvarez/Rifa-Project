import {LoaderContainerClass} from '@/lib/enums/LoaderContainerClass';
import Loader from './Loader';

const LoadingScreen = ({type, message}: any) => {
  return (
    <div className={LoaderContainerClass[type]}>
      <Loader message={message} />
    </div>
  );
};

export default LoadingScreen;
