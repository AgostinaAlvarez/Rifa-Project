import {Colors} from '@/lib/enums/Colors';
import {FontWeights} from '@/lib/enums/FontWeights';
import ErrorValidation from '@/components/Forms/Validations/ErrorsValidations';

const LabeledInput = ({children, label, required, error}: any) => {
  return (
    <div className="column-component labeled-input-container">
      <label className="label" style={{fontWeight: FontWeights.MEDIUM}}>
        {label}
        {required ? <span style={{color: Colors.RED}}> *</span> : <></>}
      </label>
      {children}
      <ErrorValidation error={error} />
    </div>
  );
};

export default LabeledInput;
