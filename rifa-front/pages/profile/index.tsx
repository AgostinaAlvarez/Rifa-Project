import HeaderPrivate from '@/components/Layout/HeaderPrivate';
import PrivateLayout from '@/components/Layout/PrivateLayout';
import Profile from '@/components/Profile/Profile';

const ProfileScreen = () => {
  return (
    <PrivateLayout seo={null}>
      <div className="container-private">
        <HeaderPrivate title={'Mi perfil'} />
        <Profile />
      </div>
    </PrivateLayout>
  );
};

export default ProfileScreen;
