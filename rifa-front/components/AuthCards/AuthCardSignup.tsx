/* eslint-disable react/no-children-prop */
import {general_header, url_back} from '@/lib/backConfigs';
import {Routes_Back} from '@/lib/enums/Routes';
import {LoadingOutlined} from '@ant-design/icons';
import {Spin} from 'antd';
import {useRouter} from 'next/router';
import {useCallback, useState} from 'react';
import {useGoogleReCaptcha} from 'react-google-recaptcha-v3';
import {Controller, useForm} from 'react-hook-form';
import {apiPost} from '@/lib/api';
import {useAppContext} from '@/lib/AppContext';
import {Colors} from '@/lib/enums/Colors';
import {errorsMessage} from '@/lib/enums/ErrorsMsg';
import {ThemePrincipalButton} from '@/lib/enums/ThemeConfigProvider';
import {TypeHtmlType} from '@/lib/enums/TypeHtmlType';
import {validationRules} from '@/lib/enums/ValidationRules';
import {handleErrorModal} from '@/lib/HandleErrors';
import ButtonG from '@/components/Buttons/ButtonG';
import InputText from '@/components/Forms/Inputs/InputText';
import LabeledInput from '@/components/Forms/Label/LabeledInput';
import RifaLogo from '@/components/Logos/RifaLogo';
import ConfirmationEmailMessage from '@/components/Modals/Contents/ConfirmationEmailMessage';
import {identify, track} from '@/lib/segment';
import {Events} from '@/lib/enums/Events';

const AuthCardSignup = () => {
  const {setCurrentModalContet} = useAppContext();
  const {executeRecaptcha} = useGoogleReCaptcha();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm({
    defaultValues: {
      email: '',
      confirmMail: '',
    },
  });

  const emailValue = watch('email');

  const getCaptcha = async () => {
    try {
      if (executeRecaptcha) {
        const token = await executeRecaptcha('submit_form');
        return {data: token, error: null};
      }
      return {data: null, error: errorsMessage.RECAPTCHA_VERIFICATION_FAILED};
    } catch (error) {
      return {data: null, error: errorsMessage.RECAPTCHA_VERIFICATION_FAILED};
    }
  };

  const onSubmit = useCallback(
    async (data: any) => {
      setLoading(true);
      const {data: captchaToken, error: recaptchaError} = await getCaptcha();

      if (!executeRecaptcha || recaptchaError) {
        setLoading(false);
        handleErrorModal({status: 406}, setCurrentModalContet, 'recaptcha');
        return;
      }

      const {data: response, error} = await apiPost(
        `${url_back}${Routes_Back.USERS.INDEX}${Routes_Back.USERS.PRE_SIGNUP}`,
        {...data, captchaToken},
        general_header
      );

      if (response) {
        const {token, _id, email, createdAt} = response;
        localStorage.setItem('user-token', token);
        localStorage.setItem('_id', _id);

        identify(_id, {email, createdAt});

        track(Events.USER_PRE_SIGNUP, {
          _id,
          email,
          createdAt,
        });

        if (response.onlySignupPending) {
          setTimeout(() => {
            router.push('/complete-profile');
          }, 2000);
          return;
        }

        setCurrentModalContet(<ConfirmationEmailMessage />);
        setTimeout(() => {
          router.push('/plans');
          setCurrentModalContet(null);
        }, 2000);
      } else {
        handleErrorModal(error, setCurrentModalContet, 'authCardSignup');
      }
      setLoading(false);
    },
    [executeRecaptcha]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-card">
      <div className="auth-card-header">
        <RifaLogo color={Colors.PRINCIPAL_COLOR} />
        <span className="subtitle">Suscripción</span>
      </div>
      <LabeledInput label={'Email'} required={true} error={errors.email}>
        <Controller
          name="email"
          control={control}
          rules={validationRules.email}
          render={({field}) => <InputText placeHolder={'Ingrese su email'} {...field} />}
        />
      </LabeledInput>
      <LabeledInput label={'Confirmar email'} required={true} error={errors.confirmMail}>
        <Controller
          name="confirmMail"
          control={control}
          rules={validationRules.confirmEmail(emailValue)}
          render={({field}) => <InputText placeHolder={'Ingrese nuevamente su email'} {...field} />}
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
                Siguiente
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

export default AuthCardSignup;
