import {useEffect, useState} from 'react';

import {auth_header, url_back} from '@/lib/backConfigs';
import {Routes_Back} from '@/lib/enums/Routes';
import PublicLayout from '@/components/Layout/PublicLayout';
import LoadingScreen from '@/components/Loaders/LoadingScreen';
import PlanCard from '@/components/Plans/PlanCard';
import SelectedPlanPayCard from '@/components/Plans/SelectedPlanPayCard';
import {apiGet} from '@/lib/api';
import {ServerSideContext} from '@/types/index';
import Custom404 from '@/pages/404';

const PlanId = ({id}: any) => {
  const [error, setError] = useState(null) as any;
  const [loading, setLoading] = useState(true);
  const [planSelected, setPlanSelected] = useState(null) as any;
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const mailAuthTkn = localStorage.getItem('user-token');

      if (!mailAuthTkn) {
        setError({message: 'Access denied', status: 'Error'} as any);
        setLoading(false);
        return;
      }

      setAuthToken(mailAuthTkn as any);

      const {data, error} = await apiGet(
        `${url_back}${Routes_Back.PLANS.INDEX}/${id}`,
        auth_header({aut_token: mailAuthTkn})
      );

      if (data) {
        setPlanSelected(data);
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
        <LoadingScreen type={'MAIN_SCREEN'} message={'Cargando...'}></LoadingScreen>
      </PublicLayout>
    );
  }

  if (error?.status) return <Custom404 />;

  return (
    <PublicLayout seo={null}>
      <div className="selected-plan-grid">
        <div className="column-componet selected-plan-grid-col selected-plan-detail-container">
          <div className="plans-screen-title-container">
            <h2>Elegi tu plan</h2>
            <h3>Multiplica tus chances de ganar</h3>
          </div>
          <PlanCard
            show_suscribe_btn={false}
            plan={planSelected ? planSelected.name : null}
            price={planSelected ? planSelected.price : null}
            benefits={planSelected ? planSelected.benefits : null}
            id={planSelected ? planSelected.id : null}
            image={planSelected ? planSelected.image : null}
          />
        </div>
        <div className="selected-plan-grid-col">
          <SelectedPlanPayCard
            id={id}
            authToken={authToken}
            plan={planSelected ? planSelected.name : null}
          />
        </div>
      </div>
    </PublicLayout>
  );
};

export async function getServerSideProps(context: ServerSideContext) {
  const {id} = context.params;

  return {
    props: {
      id,
    },
  };
}

export default PlanId;
