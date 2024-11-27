/* eslint-disable react/no-children-prop */
import ButtonG from '@/components/Buttons/ButtonG';
import {Colors} from '@/lib/enums/Colors';
import {ThemePrincipalButton} from '@/lib/enums/ThemeConfigProvider';
import {FiUser} from 'react-icons/fi';

const BtnContainerNavbarPublic = () => {
  return (
    <>
      <div className="row-component nav-bar-btn-container">
        <ButtonG
          htmlType={'button'}
          theme={ThemePrincipalButton}
          children={<FiUser className="primary-icon" />}
          className={undefined}
          handleClick={undefined}
          type={undefined}
          block={undefined}
          disable={undefined}
          style={undefined}
        />
        <ButtonG
          htmlType={'button'}
          theme={ThemePrincipalButton}
          children={
            <span className="generic-text" style={{color: Colors.BLACK}}>
              Suscribirme
            </span>
          }
          className={undefined}
          handleClick={undefined}
          type={undefined}
          block={undefined}
          disable={undefined}
          style={undefined}
        />
      </div>
    </>
  );
};

export default BtnContainerNavbarPublic;
