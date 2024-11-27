import {useEffect, useState} from 'react';

import RegisterForm from '@/components/Forms/RegisterForm';
import PrivateLayout from '@/components/Layout/PrivateLayout';
import LoadingScreen from '@/components/Loaders/LoadingScreen';
import Custom404 from '@/pages/404';

const CompleteProfile = () => {
  const [error, setError] = useState(null) as any;
  const [loading, setLoading] = useState(true);
  const [mailAuthTkn, setMailAuthTkn] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('user-token');
    const _id = localStorage.getItem('_id');
    if (!token || !_id) {
      setError({message: 'Access denied', status: 'Error'} as any);
      setTimeout(() => {
        setLoading(false);
      }, 3000);
      return;
    }
    setMailAuthTkn(token as any);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  if (loading) {
    return (
      <PrivateLayout seo={null}>
        <LoadingScreen type={'FULL_SCREEN'} message={'Cargando...'}></LoadingScreen>
      </PrivateLayout>
    );
  }

  if (error?.status) return <Custom404 />;

  return (
    <PrivateLayout seo={null}>
      <div className="container-complete-data">
        <RegisterForm mailAuthTkn={mailAuthTkn} />
      </div>
    </PrivateLayout>
  );
};

export default CompleteProfile;
