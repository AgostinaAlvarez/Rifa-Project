import {general_header, url_back} from '@/lib/backConfigs';
import {Routes_Back} from '@/lib/enums/Routes';
import {useEffect, useState} from 'react';
import LoadingScreen from '@/components/Loaders/LoadingScreen';
import VerificationEmailMessage from '@/components/Modals/Contents/VerificationEmailMessage';
import {apiPost} from '@/lib/api';
import {ServerSideContext} from '@/types/index';
import {identify, track} from '@/lib/segment';
import {Events} from '@/lib/enums/Events';

const Verify = ({token}: any) => {
  const [loading, setLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    confirmationEmail(token);
  }, []);

  const confirmationEmail = async (token: any) => {
    const {data: response, error} = await apiPost(
      `${url_back}${Routes_Back.USERS.INDEX}${Routes_Back.USERS.CONFIRM_EMAIL}`,
      {token},
      general_header
    );

    if (response) {
      const {_id, email, emailVerificationAt, isActive} = response;
      identify(_id, {
        email,
        emailVerificationAt,
        isActive,
      });
      track(Events.USER_CONFIRM_EMAIL, {
        _id,
        email,
        emailVerificationAt,
        isActive,
      });
      setIsConfirmed(true);
    } else {
      setIsConfirmed(false);
    }
    setLoading(false);
  };

  if (loading) {
    return <LoadingScreen loading={loading} type={'MAIN_SCREEN'}></LoadingScreen>;
  }

  return <VerificationEmailMessage isConfirmed={isConfirmed} />;
};

export default Verify;

export async function getServerSideProps(context: ServerSideContext) {
  const {token} = context.query;

  return {
    props: {
      token,
    },
  };
}
