import BackButton from '@/components/Buttons/BackButton';
import HeaderPrivate from '@/components/Layout/HeaderPrivate';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import EditProfileForm from '@/components/Forms/EditProfileForm';
import PrivateLayout from '@/components/Layout/PrivateLayout';
import LoadingScreen from '@/components/Loaders/LoadingScreen';
import Custom404 from '@/pages/404';

const EditProfile = () => {
  const [error, setError] = useState(null) as any;
  const [loading, setLoading] = useState(true);
  const [mailAuthTkn, setMailAuthTkn] = useState(null);
  const router = useRouter();
  const handleBack = () => {
    router.push('/profile');
  };
  useEffect(() => {
    const token = localStorage.getItem('user-token');
    if (!token) {
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
      <div className="container-private">
        <HeaderPrivate title={'Mi perfil'} />
        <BackButton handleBack={handleBack} />
        <div className="content-update">
          <EditProfileForm mailAuthTkn={mailAuthTkn} />
        </div>
      </div>
    </PrivateLayout>
  );
};

export default EditProfile;
