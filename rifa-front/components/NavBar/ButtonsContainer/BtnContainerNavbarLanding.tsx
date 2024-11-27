/* eslint-disable react/no-children-prop */
import ButtonG from '@/components/Buttons/ButtonG';
import {Colors} from '@/lib/enums/Colors';
import {ThemePrincipalButton} from '@/lib/enums/ThemeConfigProvider';
import {useAppContext} from '@/lib/AppContext';

const BtnContainerNavbarLanding = () => {
  const {actionButton} = useAppContext();
  return (
    <>
      <div className="row-component nav-bar-btn-container">
        <ButtonG
          htmlType={'button'}
          theme={ThemePrincipalButton}
          children={
            <span className="generic-text" style={{color: Colors.BLACK}}>
              Suscribete aqui
            </span>
          }
          className={undefined}
          handleClick={() => {
            actionButton('/pre-signup');
          }}
          type={undefined}
          block={undefined}
          disable={undefined}
          style={undefined}
        />
      </div>
    </>
  );
};
export default BtnContainerNavbarLanding;
