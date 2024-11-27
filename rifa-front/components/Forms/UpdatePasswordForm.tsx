/* eslint-disable react/no-children-prop */
import {auth_header, url_back} from '@/lib/backConfigs';
import {Routes, Routes_Back} from '@/lib/enums/Routes';
import {LoadingOutlined} from '@ant-design/icons';
import {Spin} from 'antd';
import {useRouter} from 'next/router';
import {useCallback, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {apiPut} from '@/lib/api';
import {useAppContext} from '@/lib/AppContext';
import {Colors} from '@/lib/enums/Colors';
import {errorsMessage} from '@/lib/enums/ErrorsMsg';
import {ThemePrincipalButton} from '@/lib/enums/ThemeConfigProvider';
import {TypeHtmlType} from '@/lib/enums/TypeHtmlType';
import {validationRules} from '@/lib/enums/ValidationRules';
import ButtonG from '@/components/Buttons/ButtonG';
import {Icons} from '@/components/Icons/Icons';
import ModalComponent from '@/components/Modals/ModalComponent';
import InputPassword from '@/components/Forms/Inputs/InputPassword';
import LabeledInput from '@/components/Forms/Label/LabeledInput';

const FormUpdatePassword = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    setError,
    watch,
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  const {setCurrentModalContet} = useAppContext();

  const passwordValue = watch('newPassword');

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const onSubmit = useCallback(async (data: any) => {
    setLoading(true);
    const mailAuthTkn = localStorage.getItem('user-token');

    if (!mailAuthTkn) {
      setLoading(false);
      return;
    }

    const {data: response, error} = await apiPut(
      `${url_back}${Routes_Back.USERS.INDEX}${Routes_Back.USERS.PASSWORD_CHANGE}`,
      {...data},
      auth_header({aut_token: mailAuthTkn})
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
        router.push(`${Routes.PROFILE.INDEX}`);
        setCurrentModalContet(null);
      }, 2000);
    } else if (error?.status === 412) {
      setError('currentPassword', {
        type: 'manual',
        message: errorsMessage.INCORRECT_CURRENT_PASSWORD,
      });
    } else {
      setCurrentModalContet(
        <ModalComponent>
          <>
            {Icons.ERROR}
            <p>Hubo un error al cambiar tu contraseña</p>
          </>
        </ModalComponent>
      );
      setTimeout(() => {
        setCurrentModalContet(null);
      }, 2000);
    }
    setLoading(false);
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-card register-form-container">
      <div className="auth-card-header">
        <span className="subtitle">Editar contraseña</span>
      </div>
      <LabeledInput label={'Contraseña anterior'} required={true} error={errors.currentPassword}>
        <Controller
          name="currentPassword"
          control={control}
          rules={validationRules.password}
          render={({field}) => (
            <InputPassword placeHolder={'Ingrese su contraseña anterior'} {...field} />
          )}
        />
      </LabeledInput>
      <LabeledInput label={'Contraseña'} required={true} error={errors.newPassword}>
        <Controller
          name="newPassword"
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
            <InputPassword placeHolder={'Ingrese nuevamente su contraseña '} {...field} />
          )}
        />
      </LabeledInput>
      <ButtonG
        htmlType={TypeHtmlType.SUBMIT}
        className={'auth-card-btn'}
        theme={ThemePrincipalButton}
        children={
          <>
            {loading ? (
              <Spin indicator={<LoadingOutlined spin />} />
            ) : (
              <span style={{color: Colors.BLACK}} className="nav-text">
                Actualizar contraseña
              </span>
            )}
          </>
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
export default FormUpdatePassword;
