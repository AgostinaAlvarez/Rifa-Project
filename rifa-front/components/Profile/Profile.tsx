import ButtonG from '@/components/Buttons/ButtonG';
import {useAppContext} from '@/lib/AppContext';
import {Colors} from '@/lib/enums/Colors';
import {errorsMessage} from '@/lib/enums/ErrorsMsg';
import {Routes} from '@/lib/enums/Routes';
import {ThemePrincipalButton} from '@/lib/enums/ThemeConfigProvider';
import dayjs from 'dayjs';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {FiEdit2} from 'react-icons/fi';
const Profile = () => {
  const {userData} = useAppContext();
  const router = useRouter();
  const userName = userData?.fullName || errorsMessage.NOT_FOUND_DATA;
  const userEmail = userData?.email || errorsMessage.NOT_FOUND_DATA;
  const phone = userData?.phone || errorsMessage.NOT_FOUND_DATA;
  const birthday = userData?.birthday
    ? dayjs(userData.birthday).format('DD/MM/YYYY')
    : errorsMessage.NOT_FOUND_DATA;

  const handleRedirectEditProfile = () => {
    router.push(`${Routes.PROFILE.INDEX}/${Routes.PROFILE.EDIT}`);
  };
  const handleRedirectUpdatePassword = () => {
    router.push(`${Routes.PROFILE.INDEX}/${Routes.PROFILE.UPDATE_PASSWORD}`);
  };
  return (
    <>
      <div className="container-profile">
        <div className="container-name">
          <div className="container-data">
            <Image
              src="/assets/user-avatar-default.webp"
              alt="imagen perfil usuario"
              className="user-avatar"
              height={100}
              width={100}
            />
            <div className="data-name">
              <h3 className="name-ttl">{userName}</h3>
              <p>{userEmail}</p>
            </div>
          </div>
          <div className="btn-edit">
            <ButtonG theme={ThemePrincipalButton} handleClick={handleRedirectEditProfile}>
              <FiEdit2 color={Colors.BLACK} />
            </ButtonG>
          </div>
        </div>
        <div className="list-data">
          <div className="list-detail">
            <p className="label">Nombre completo</p>
            <div className="input-data">
              <p>{userName}</p>
            </div>
          </div>
          <div className="list-detail">
            <p className="label">Fecha de nacimiento</p>
            <div className="input-data">
              <p>{birthday}</p>
            </div>
          </div>
          <div className="list-detail">
            <p className="label">Teléfono</p>
            <div className="input-data">
              <p>{phone}</p>
            </div>
          </div>
        </div>
        <div className="container-pass">
          <h4>Contraseña </h4>
          <div className="btn-edit-pass">
            <p>Cambiar contraseña </p>
            <ButtonG theme={ThemePrincipalButton} handleClick={handleRedirectUpdatePassword}>
              <FiEdit2 color={Colors.BLACK} />
            </ButtonG>
          </div>
        </div>
      </div>
    </>
  );
};
export default Profile;
