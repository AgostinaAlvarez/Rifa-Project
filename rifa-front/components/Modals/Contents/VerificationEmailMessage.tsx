/* eslint-disable react/no-children-prop */
import {useRouter} from 'next/router';
import {ButtonMsg} from '@/lib/enums/ButtonsMsg';
import {Colors} from '@/lib/enums/Colors';
import {EmailMsg} from '@/lib/enums/EmailMsg';
import {ThemePrincipalButton} from '@/lib/enums/ThemeConfigProvider';
import {TypeHtmlType} from '@/lib/enums/TypeHtmlType';
import ButtonG from '@/components/Buttons/ButtonG';
import {Icons} from '@/components/Icons/Icons';

const VerificationEmailMessage = ({isConfirmed}: any) => {
  const {IS_VERIFIED, IS_NOT_VERIFIED, IS_VERIFIED_PARAGRAPH} = EmailMsg;
  const titleText = isConfirmed ? IS_VERIFIED : IS_NOT_VERIFIED;
  const paragraphText = isConfirmed ? IS_VERIFIED_PARAGRAPH : '';

  const route = useRouter();

  return (
    <div className="verification-message">
      <div className="verification-icon">{isConfirmed ? Icons.CHECKMARK : Icons.ERROR}</div>
      <div className="verification-content">
        <h1 className="subtitle">{titleText}</h1>
        {paragraphText && <p>{paragraphText}</p>}
        <ButtonG
          handleClick={() => {
            route.push('/');
          }}
          htmlType={TypeHtmlType.BUTTON}
          className="verification-button"
          theme={ThemePrincipalButton}
          children={
            <span style={{color: Colors.BLACK}} className="nav-text">
              {isConfirmed ? ButtonMsg.CONTINUE : ButtonMsg.BACK}
            </span>
          }
        />
      </div>
    </div>
  );
};
export default VerificationEmailMessage;
