/* eslint-disable react/no-children-prop */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import ButtonG from '@/components/Buttons/ButtonG';
import {apiPost} from '@/lib/api';
import {useAppContext} from '@/lib/AppContext';
import {auth_header, url_back} from '@/lib/backConfigs';
import {Colors} from '@/lib/enums/Colors';
import {Events} from '@/lib/enums/Events';
import {Routes, Routes_Back} from '@/lib/enums/Routes';
import {ThemeSecondaryButton} from '@/lib/enums/ThemeConfigProvider';
import {handleErrorModal} from '@/lib/HandleErrors';
import {track} from '@/lib/segment';
import {useRouter} from 'next/router';
import {useCallback, useState} from 'react';

const BtnContainerNavbarPrivate = () => {
  const {setCurrentModalContet, setLogged, setUserData, userData} = useAppContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const email = userData?.email;

  const handleLogOut = useCallback(async () => {
    setLoading(true);

    const mailAuthTkn = localStorage.getItem('user-token');
    const _id = localStorage.getItem('_id');

    if (!mailAuthTkn) {
      setLoading(false);
      return;
    }

    const {data: response, error} = await apiPost(
      `${url_back}${Routes_Back.AUTH.INDEX}${Routes_Back.AUTH.LOGOUT}`,
      null,
      auth_header({aut_token: mailAuthTkn})
    );

    if (response) {
      localStorage.clear();

      setLogged(false);
      setUserData(null);

      track(Events.USER_LOGOUT, {_id, email});

      router.push(`${Routes.SIGN_IN.INDEX}`);
    } else {
      handleErrorModal(error, setCurrentModalContet);
    }
  }, [router, setLogged, setUserData, setCurrentModalContet]);
  return (
    <>
      <div className="row-component nav-bar-btn-container" onClick={handleLogOut}>
        <ButtonG
          htmlType={'button'}
          style={{color: Colors.GREY}}
          theme={ThemeSecondaryButton}
          children={<img src="/assets/icons/LogOutIcon.svg" className="btn-logOut" />}
          className={undefined}
          handleClick={handleLogOut}
          type={undefined}
          block={undefined}
          disable={undefined}
        />
        <span className="nav-text-private">Cerrar sesión</span>
      </div>
    </>
  );
};

export default BtnContainerNavbarPrivate;
