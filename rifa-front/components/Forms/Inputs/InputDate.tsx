import {ConfigProvider, DatePicker} from 'antd';
import {SizeType} from 'antd/es/config-provider/SizeContext';
import {Sizes} from '@/lib/enums/Size';
import {formatDateToISO, parseISOToDate} from '@/lib/functions';

const InputDate = ({placeHolder, value, onChange}: any) => {
  const handleChange = (date: Date, dateString: any) => {
    if (date) {
      const isoDate = formatDateToISO(date);
      onChange(isoDate);
    } else {
      onChange(null);
    }
  };
  const displayValue = parseISOToDate(value);
  return (
    <ConfigProvider componentSize={Sizes.LARGE as SizeType}>
      <DatePicker
        placeholder={placeHolder}
        value={displayValue}
        onChange={handleChange}
        className="generic-input"
        format="DD-MM-YYYY"
      />
    </ConfigProvider>
  );
};

export default InputDate;
