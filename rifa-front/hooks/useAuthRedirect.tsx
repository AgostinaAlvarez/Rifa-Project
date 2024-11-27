import {useAppContext} from '@/lib/AppContext';
import {validateToken} from '@/lib/auth';
import {Routes} from '@/lib/enums/Routes';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';

const PRIVATE_ROUTES = [
  Routes.DASHBOARD,
  Routes.PROFILE.INDEX,
  Routes.PROFILE.EDIT,
  Routes.PROFILE.UPDATE_PASSWORD,
];

const ONBORDING_ROUTES = [
  Routes.SIGN_IN.INDEX,
  Routes.PRE_SIGNUP.INDEX,
  Routes.COMPLETE_PROFILE.INDEX,
  Routes.FORGOT_PASSWORD.INDEX,
  Routes.PLANS.INDEX,
];

const useAuthRedirect = () => {
  const router = useRouter();
  const {setLogged} = useAppContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('user-token');
      const valid = await validateToken(token);
      setLogged(valid);

      const isPrivateRoute = PRIVATE_ROUTES.includes(router.pathname);
      const isOnbordingRoute = ONBORDING_ROUTES.includes(router.pathname);

      if (!valid && isPrivateRoute) {
        router.push(`${Routes.SIGN_IN.INDEX}`);
      } else if (valid && isOnbordingRoute) {
        router.push(`${Routes.DASHBOARD.INDEX}`);
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return loading;
};

export default useAuthRedirect;
