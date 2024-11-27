import {Routes} from '@/lib/enums/Routes';
import {useRouter} from 'next/router';

const OptionsNavbarPrivate = () => {
  const router = useRouter();
  const HandleRedirect = (url: string) => {
    router.push(url);
  };

  return (
    <ul className="row-component nav-bar-suboptions">
      <li className="nav-text" onClick={() => HandleRedirect(`${Routes.DASHBOARD.INDEX}`)}>
        Inicio
      </li>
      <li className="nav-text">Suscripción</li>
      <li className="nav-text">Premios</li>
      <li className="nav-text" onClick={() => HandleRedirect(`${Routes.PROFILE.INDEX}`)}>
        Mi perfil
      </li>
    </ul>
  );
};

export default OptionsNavbarPrivate;
