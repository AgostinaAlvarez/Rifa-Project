/* eslint-disable react/no-children-prop */
import {useRouter} from 'next/router';
import {ButtonMsg} from '@/lib/enums/ButtonsMsg';
import {Colors} from '@/lib/enums/Colors';
import {ErrorStatus} from '@/lib/enums/ErrorStatus';
import {ThemePrincipalButton} from '@/lib/enums/ThemeConfigProvider';
import {TypeHtmlType} from '@/lib/enums/TypeHtmlType';
import ButtonG from '@/components/Buttons/ButtonG';

const ErrorComponent = ({errorType}: any) => {
  const {type, message} = ErrorStatus[errorType];
  const router = useRouter();

  return (
    <div className="complete-screen-layout">
      <div className="error-container">
        <div className="error-content">
          <h1 className="error-title">{type}</h1>
          <p className="error-message">{message}</p>
          <ButtonG
            handleClick={() => {
              router.push('/ ');
            }}
            htmlType={TypeHtmlType.BUTTON}
            theme={ThemePrincipalButton}
            className={'error-button'}
            children={
              <span style={{color: Colors.BLACK}} className="nav-text">
                {ButtonMsg.BACK}
              </span>
            }
            type={undefined}
            block={undefined}
            disable={undefined}
            style={undefined}
          />
        </div>
      </div>
    </div>
  );
};
export default ErrorComponent;
