/* eslint-disable react/no-children-prop */
import {general_header, url_back} from '@/lib/backConfigs';
import {Routes, Routes_Back} from '@/lib/enums/Routes';
import {useRouter} from 'next/router';
import {useCallback, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {apiPut} from '@/lib/api';
import {useAppContext} from '@/lib/AppContext';
import {Colors} from '@/lib/enums/Colors';
import {ThemePrincipalButton} from '@/lib/enums/ThemeConfigProvider';
import {TypeHtmlType} from '@/lib/enums/TypeHtmlType';
import {validationRules} from '@/lib/enums/ValidationRules';
import ButtonG from '@/components/Buttons/ButtonG';
import {Icons} from '@/components/Icons/Icons';
import RifaLogo from '@/components/Logos/RifaLogo';
import ModalComponent from '@/components/Modals/ModalComponent';
import InputPassword from '@/components/Forms/Inputs/InputPassword';
import LabeledInput from '@/components/Forms/Label/LabeledInput';

const ChangePasswordForm = () => {
  const {query} = useRouter();

  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const {setCurrentModalContet} = useAppContext();

  const passwordValue = watch('password');

  const route = useRouter();

  const [loading, setLoading] = useState(false);

  const token = query.token;

  const onSubmit = useCallback(
    async (data: any) => {
      setLoading(true);

      const requestData = {
        ...data,
        token,
      };

      const {data: response} = await apiPut(
        `${url_back}${Routes_Back.USERS.INDEX}${Routes_Back.USERS.PASSWORD_RESET}`,
        requestData,
        general_header
      );
      if (response) {
        setCurrentModalContet(
          <ModalComponent>
            <>
              {Icons.CHECKMARK}
              <p>¡Tu contraseña fue cambiada exitosamente!</p>
            </>
          </ModalComponent>
        );
        setTimeout(() => {
          route.push(`${Routes.SIGN_IN.INDEX}`);
          setCurrentModalContet(null);
        }, 2000);
      } else {
        setCurrentModalContet(
          <ModalComponent>
            <>
              {Icons.ERROR}
              <p>¡Error al cambiar contraseña!</p>
            </>
          </ModalComponent>
        );

        setTimeout(() => {
          route.push(`${Routes.SIGN_IN.INDEX}`);
          setCurrentModalContet(null);
        }, 5000);
      }
      setLoading(false);
    },
    [setCurrentModalContet, token, route]
  );
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-card">
      <div className="auth-card-header">
        <RifaLogo color={Colors.PRINCIPAL_COLOR} />
        <span className="subtitle">Nueva contraseña</span>
      </div>
      <LabeledInput label={'Contraseña'} required={true} error={errors.password}>
        <Controller
          name="password"
          control={control}
          rules={validationRules.password}
          render={({field}) => (
            <InputPassword placeHolder={'Ingrese su nueva contraseña'} {...field} />
          )}
        />
      </LabeledInput>
      <LabeledInput label={'Confirmar contraseña'} required={true} error={errors.confirmPassword}>
        <Controller
          name="confirmPassword"
          control={control}
          rules={validationRules.confirmField(passwordValue)}
          render={({field}) => (
            <InputPassword placeHolder={'Ingrese su contraseña nuevamente'} {...field} />
          )}
        />
      </LabeledInput>
      <ButtonG
        htmlType={TypeHtmlType.SUBMIT}
        className={'auth-card-btn'}
        theme={ThemePrincipalButton}
        children={
          <span style={{color: Colors.BLACK}} className="nav-text">
            Cambiar contraseña
          </span>
        }
        handleClick={undefined}
        type={undefined}
        block={undefined}
        disable={undefined}
        style={undefined}
      />
    </form>
  );
};
export default ChangePasswordForm;
