/* eslint-disable react/no-children-prop */
import {Routes} from '@/lib/enums/Routes';
import {useRouter} from 'next/router';
import React from 'react';
import {Colors} from '@/lib/enums/Colors';
import {ThemePrincipalButton} from '@/lib/enums/ThemeConfigProvider';
import ButtonG from '@/components/Buttons/ButtonG';
import WordMark from '@/components/Logos/WordMark';
import {identify, track} from '@/lib/segment';
import {Events} from '@/lib/enums/Events';

const PlanCard = ({plan, benefits, price, id, image, show_suscribe_btn}: any) => {
  const router = useRouter();

  const HandleClick = () => {
    const _id = localStorage.getItem('_id');
    const planId = id;
    const planName = plan;
    identify(_id, {planId, planName});
    track(Events.PLAN_SELECTED, {_id, planId, planName});
    router.push(`${Routes.PLANS.INDEX}/${id}`);
  };

  return (
    <div className="plan-card-container">
      <img src={image} className="plan-card-image" />
      <div className="column-component plan-card-information-container">
        <WordMark
          color={Colors.PRINCIPAL_COLOR}
          label={<span className="subtitle plan-card-title-label">{plan}</span>}
        />
        <div className="column-component plan-card-information-subcontainer">
          {benefits.length && benefits ? (
            <ul className="column-component plan-card-benefits-container">
              {benefits.map(
                (
                  benefit: {
                    differential: boolean;
                    description: string | null | undefined;
                  },
                  index: React.Key | null | undefined
                ) => (
                  <li
                    key={index}
                    className={`label ${
                      benefit.differential === true
                        ? 'plan-card-benefit-differential'
                        : 'plan-card-benefit'
                    }`}
                  >
                    {benefit.description}
                  </li>
                )
              )}
            </ul>
          ) : (
            <></>
          )}
          <span className="label plan-card-price">${price.toLocaleString('es-CL')} CLP</span>
          {show_suscribe_btn ? (
            <ButtonG
              className="plan-card-btn"
              theme={ThemePrincipalButton}
              children={<span>¡Suscríbete aquí!</span>}
              handleClick={HandleClick}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
