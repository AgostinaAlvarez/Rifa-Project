/* eslint-disable react/no-children-prop */
import ButtonG from '@/components/Buttons/ButtonG';
import InputPassword from '@/components/Forms/Inputs/InputPassword';
import InputText from '@/components/Forms/Inputs/InputText';
import LabeledInput from '@/components/Forms/Label/LabeledInput';
import TimerComponent from '@/components/Loaders/TimerComponent';
import WordMark from '@/components/Logos/WordMark';
import {apiPost} from '@/lib/api';
import {useAppContext} from '@/lib/AppContext';
import {general_header, url_back} from '@/lib/backConfigs';
import {Colors} from '@/lib/enums/Colors';
import {Events} from '@/lib/enums/Events';
import {Routes_Back} from '@/lib/enums/Routes';
import {ThemePrincipalButton} from '@/lib/enums/ThemeConfigProvider';
import {TypeHtmlType} from '@/lib/enums/TypeHtmlType';
import {validationRules} from '@/lib/enums/ValidationRules';
import {handleErrorModal} from '@/lib/HandleErrors';
import {identify, track} from '@/lib/segment';
import {LoadingOutlined} from '@ant-design/icons';
import {Spin} from 'antd';
import {useRouter} from 'next/router';
import {useCallback, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';

const AuthCardLogin = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const {setCurrentModalContet, setLogged, setUserData} = useAppContext();

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleRedirectCompleteData = () => {
    setCurrentModalContet(null);
    router.push('/pre-signup');
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  const onSubmit = useCallback(async (data: any) => {
    setLoading(true);

    const {data: response, error} = await apiPost(
      `${url_back}${Routes_Back.AUTH.INDEX}${Routes_Back.AUTH.SIGNIN}`,
      data,
      general_header
    );
    if (response) {
      const {
        token,
        birthday,
        email,
        finishedSuscriptionAt,
        fullName,
        identificationFull,
        plan,
        phone,
        _id,
      } = response;
      localStorage.setItem('user-token', token);
      localStorage.setItem('_id', _id);
      const userDataObjt = {
        birthday,
        email,
        finishedSuscriptionAt,
        fullName,
        identificationFull,
        plan,
        phone,
      };
      identify(_id, {email});
      track(Events.USER_SIGNIN, {_id, email});
      setUserData(userDataObjt);
      setTimeout(() => {
        setLogged(true);
        router.push('/dashboard');
      }, 1000);
    } else {
      const status = error.status;
      if (status === 409) {
        handleErrorModal(
          error,
          setCurrentModalContet,
          'authCardSignin',
          <TimerComponent redirectUrl={'/pre-signup'} handleClick={handleRedirectCompleteData} />
        );
      } else {
        handleErrorModal(error, setCurrentModalContet);
      }
    }
    setLoading(false);
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-card">
      <div className="auth-card-header">
        <span className="subtitle subtitle-login">Bienvenido a</span>
        <WordMark
          color={Colors.PRINCIPAL_COLOR}
          label={
            <span style={{color: Colors.PRINCIPAL_COLOR}} className="subtitle">
              RifaClub
            </span>
          }
        />
      </div>
      <LabeledInput label={'Email'} required={true} error={errors.email}>
        <Controller
          name="email"
          control={control}
          rules={validationRules.email}
          render={({field}) => <InputText placeHolder={'Ingrese su email'} {...field} />}
        />
      </LabeledInput>
      <LabeledInput label={'Contraseña'} required={true} error={errors.password}>
        <Controller
          name="password"
          control={control}
          rules={validationRules.password}
          render={({field}) => <InputPassword placeHolder={'Ingrese su contraseña'} {...field} />}
        />
      </LabeledInput>
      <div className="auth-card-login-forgot-password-container">
        <span
          onClick={handleForgotPassword}
          className="generic-text login-label forgot-password-text"
        >
          Olvide mi contraseña
        </span>
      </div>
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
                Iniciar sesion
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
      <div className="auth-card-login-forgot-create-acount-container">
        <span className="generic-text login-label">
          ¿No tienes cuenta? <span className="title login-label">Suscríbete a Rifa Club</span>
        </span>
      </div>
    </form>
  );
};

export default AuthCardLogin;
