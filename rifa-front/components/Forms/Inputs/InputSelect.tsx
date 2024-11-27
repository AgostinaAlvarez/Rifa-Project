import {ConfigProvider, Select} from 'antd';
import {SizeType} from 'antd/es/config-provider/SizeContext';
import {FaChevronDown} from 'react-icons/fa6';
import {Colors} from '@/lib/enums/Colors';
import {PrincipalStyle} from '@/lib/enums/SelectStyle';
import {Sizes} from '@/lib/enums/Size';

const InputSelect = ({options, placeHolder, value, handleChange}: any) => {
  return (
    <ConfigProvider componentSize={Sizes.LARGE as SizeType} theme={PrincipalStyle}>
      <Select
        placeholder={placeHolder}
        options={options}
        value={value}
        onClick={handleChange}
        suffixIcon={<FaChevronDown color={Colors.DISABLE} size={14} className="generic-select" />}
      />
    </ConfigProvider>
  );
};
export default InputSelect;
