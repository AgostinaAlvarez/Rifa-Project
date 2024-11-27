/* eslint-disable react/no-children-prop */
import {auth_header, url_back} from '@/lib/backConfigs';
import {Routes_Back} from '@/lib/enums/Routes';
import {CardPayment, initMercadoPago} from '@mercadopago/sdk-react';
import {useCallback, useEffect, useState} from 'react';
import {apiPost} from '@/lib/api';
import {useAppContext} from '@/lib/AppContext';
import {Colors} from '@/lib/enums/Colors';
import {ThemePrincipalButton} from '@/lib/enums/ThemeConfigProvider';
import {customization, initialization, paymentClass} from '@/lib/MPCardPaymentConfigs';
import ButtonG from '@/components/Buttons/ButtonG';
import RifaLogo from '@/components/Logos/RifaLogo';
import ErrorPayment from '@/components/Modals/Contents/ErrorPayment';
import {identify, track} from '@/lib/segment';
import {Events} from '@/lib/enums/Events';

const SelectedPlanPayCard = ({id, authToken, plan}: any) => {
  const {setCurrentModalContet} = useAppContext();
  const _id = localStorage.getItem('_id');

  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY as string, {
      locale: 'es-CL',
    });
  }, []);

  const [isReady, setIsReady] = useState(false);

  const [showCheckoutButton, setShowCheckoutButton] = useState(false);

  const catchInitMercadoPago = () => {
    track(Events.USER_INIT_MERCADOPAGO, {id: _id, planId: id, planName: plan});
  };

  const catchRedirectMercadoPago = (subscriptionId: any) => {
    identify(_id, {planId: id, planName: plan, subscriptionId});
    track(Events.USER_REDIRECT_MERCADOPAGO, {_id, planId: id, planName: plan, subscriptionId});
  };

  const HandleOnClick = () => {
    catchInitMercadoPago();
    setShowCheckoutButton(true);
  };

  const handleOnReady = () => {
    setIsReady(true);
  };

  const onError = async (error: any) => {
    console.log(error);
  };

  const handleSubmit = useCallback(async (formData: {token: any; payer: any}) => {
    const {token, payer} = formData;
    const payerEmail = payer.email;

    const {data: response} = await apiPost(
      `${url_back}${Routes_Back.PLANS.INDEX}/${id}${Routes_Back.PLANS.CREATE_SUSCRIPTION}`,
      {cardTokenId: token, payerEmail},
      auth_header({aut_token: authToken})
    );

    if (response) {
      catchRedirectMercadoPago(response.subscriptionId);
      setTimeout(() => {
        window.location.href = response.initPoint;
      }, 1000);
    } else {
      setCurrentModalContet(<ErrorPayment />);
    }
  }, []);

  const renderCheckoutButton = () => {
    return (
      <CardPayment
        initialization={initialization}
        onReady={handleOnReady}
        onError={onError}
        onSubmit={handleSubmit}
        customization={customization}
      />
    );
  };

  return (
    <div className="selected-plan-pay-card-container">
      <RifaLogo color={Colors.PRINCIPAL_COLOR} />
      <span className="subtitle plan-card-title-label">Suscripción</span>
      <div className="row-component selected-plan-pay-mp-label">
        <img className="selected-plan-pay-mp-icon" src="/assets/icons/mp-icon.svg" />
        <span className="subtitle selected-plan-pay-label">Pagá seguro con Mercado Pago</span>
      </div>
      {showCheckoutButton ? (
        <div className={paymentClass(isReady)}>{renderCheckoutButton()}</div>
      ) : (
        <ButtonG
          handleClick={HandleOnClick}
          className="selected-plan-pay-btn"
          theme={ThemePrincipalButton}
          children={<span className="strong-label">Pagar</span>}
        />
      )}
    </div>
  );
};

export default SelectedPlanPayCard;
