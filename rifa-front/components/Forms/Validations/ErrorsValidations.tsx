import {Form} from 'antd';
import {FontWeights} from '@/lib/enums/FontWeights';

const ErrorValidation = ({error}: any) => {
  if (!error) return null;

  return (
    <Form.Item
      validateStatus="error"
      help={error.message}
      className="error-message"
      style={{fontWeight: FontWeights.LIGHT}}
    />
  );
};

export default ErrorValidation;
