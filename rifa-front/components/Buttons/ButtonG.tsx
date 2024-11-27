import {Button, ConfigProvider} from 'antd';
import {TypeButtonEnum} from '@/lib/enums/TypeButtonEnum';
import {TypeHtmlType} from '@/lib/enums/TypeHtmlType';

const customButtonGStyle = {
  height: '45px',
};

const ButtonG = ({
  children,
  theme,
  className,
  handleClick,
  type,
  block,
  disable,
  htmlType,
  style,
}: any) => {
  return (
    <ConfigProvider theme={theme ? theme : null}>
      <Button
        className={className}
        onClick={handleClick}
        type={type ? type : TypeButtonEnum.PRIMARY}
        style={{...customButtonGStyle, ...style}}
        block={block}
        disabled={disable}
        htmlType={htmlType ? htmlType : TypeHtmlType.BUTTON}
      >
        {children}
      </Button>
    </ConfigProvider>
  );
};

export default ButtonG;
