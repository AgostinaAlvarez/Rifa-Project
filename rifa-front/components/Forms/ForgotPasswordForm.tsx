/* eslint-disable react/no-children-prop */
import {general_header, url_back} from '@/lib/backConfigs';
import {Routes, Routes_Back} from '@/lib/enums/Routes';
import {useRouter} from 'next/router';
import {useCallback, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {apiPost} from '@/lib/api';
import {useAppContext} from '@/lib/AppContext';
import {Colors} from '@/lib/enums/Colors';
import {ThemePrincipalButton} from '@/lib/enums/ThemeConfigProvider';
import {TypeHtmlType} from '@/lib/enums/TypeHtmlType';
import {validationRules} from '@/lib/enums/ValidationRules';
import {handleErrorModal} from '@/lib/HandleErrors';
import ButtonG from '@/components/Buttons/ButtonG';
import RifaLogo from '@/components/Logos/RifaLogo';
import ModalComponent from '@/components/Modals/ModalComponent';
import InputText from '@/components/Forms/Inputs/InputText';
import LabeledInput from '@/components/Forms//Label/LabeledInput';
import {track} from '@/lib/segment';
import {Events} from '@/lib/enums/Events';

const ForgotPasswordForm = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const {setCurrentModalContet} = useAppContext();

  const [loading, setLoading] = useState(false);

  const route = useRouter();

  const onSubmit = useCallback(
    async (data: any) => {
      setLoading(true);
      const {data: response, error} = await apiPost(
        `${url_back}${Routes_Back.USERS.INDEX}${Routes_Back.USERS.PASSWORD_RECOVERY}`,
        {...data},
        general_header
      );

      if (response) {
        const {email} = data;
        track(Events.USER_PASSWORD_RECOVERY, {emailToRecover: email});
        setCurrentModalContet(
          <ModalComponent>
            <>
              <h3>Email enviado</h3>
              <p>No te olvides de revisar tu casilla de mensajes.</p>
            </>
          </ModalComponent>
        );
        setTimeout(() => {
          route.push(`${Routes.SIGN_IN.INDEX}`);
          setCurrentModalContet(null);
        }, 2000);
      } else {
        handleErrorModal(error, setCurrentModalContet);
        setTimeout(() => {
          route.push(`${Routes.SIGN_IN.INDEX}`);
        });
      }
      setLoading(false);
    },
    [setCurrentModalContet, route]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-card">
      <div className="auth-card-header">
        <RifaLogo color={Colors.PRINCIPAL_COLOR} />
        <span className="subtitle">Recuperar contraseña</span>
        <p className="text-forgot">
          Ingresa tu email y te enviaremos un correo para restablecer tu contraseña.
        </p>
      </div>
      <LabeledInput label={'Email'} required={true} error={errors.email}>
        <Controller
          name="email"
          control={control}
          rules={validationRules.email}
          render={({field}) => <InputText placeHolder={'Ingrese su email'} {...field} />}
        />
      </LabeledInput>

      <ButtonG
        htmlType={TypeHtmlType.SUBMIT}
        className={'auth-card-btn'}
        theme={ThemePrincipalButton}
        children={
          <span style={{color: Colors.BLACK}} className="nav-text">
            Recuperar contraseña
          </span>
        }
      />
    </form>
  );
};
export default ForgotPasswordForm;
