import {useEffect, useState} from 'react';

import {auth_header, url_back} from '@/lib/backConfigs';
import {Routes_Back} from '@/lib/enums/Routes';
import PublicLayout from '@/components/Layout/PublicLayout';
import LoadingScreen from '@/components/Loaders/LoadingScreen';
import PlanCard from '@/components/Plans/PlanCard';
import {apiGet} from '@/lib/api';
import Custom404 from '@/pages/404';

const Plans = () => {
  const [error, setError] = useState(null) as any;
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const mailAuthTkn = localStorage.getItem('user-token');
      const _id = localStorage.getItem('_id');

      if (!mailAuthTkn || !_id) {
        setError({message: 'Access denied', status: 'Error'} as any);
        setLoading(false);
        return;
      }

      const {data, error} = await apiGet(
        `${url_back}${Routes_Back.PLANS.INDEX}`,
        auth_header({aut_token: mailAuthTkn})
      );

      if (data) {
        setPlans(data);
      } else {
        setError(error);
      }
      setLoading(false);
    };

    getData();
  }, []);

  if (loading) {
    return (
      <PublicLayout seo={null}>
        <LoadingScreen error={error} type={'MAIN_SCREEN'} message={'Cargando...'}></LoadingScreen>
      </PublicLayout>
    );
  }

  if (error?.status) return <Custom404 />;

  return (
    <PublicLayout seo={null}>
      <>
        <div className="plans-screen-title-container">
          <h2 className="auth-bg-ttl">Elegí tu plan</h2>
          <h3 className="auth-bg-subttl">Multiplica tus chances de ganar</h3>
        </div>
        <div className="plans-screen-cards-container">
          {plans && plans.length ? (
            <>
              {plans.map((plan: {_id: any; name: any; benefits: any; price: any; image: any}) => (
                <PlanCard
                  key={plan._id}
                  plan={plan.name}
                  benefits={plan.benefits}
                  price={plan.price}
                  id={plan._id}
                  image={plan.image}
                  show_suscribe_btn={true}
                />
              ))}
            </>
          ) : (
            <></>
          )}
        </div>
      </>
    </PublicLayout>
  );
};

export default Plans;
