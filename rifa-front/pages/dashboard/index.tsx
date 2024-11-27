import PrivateLayout from '@/components/Layout/PrivateLayout';
import {useAppContext} from '@/lib/AppContext';

const Dashboard = () => {
  const {userData} = useAppContext();

  return (
    <PrivateLayout seo={null}>
      <>
        <h1>Bienvenido {userData?.fullName}</h1>
        <div>User Dashboard Screen</div>
        <div>Plan: {userData?.plan?.name}</div>
      </>
    </PrivateLayout>
  );
};

export default Dashboard;
