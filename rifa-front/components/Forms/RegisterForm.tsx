/* eslint-disable react/no-children-prop */
import {auth_header, url_back} from '@/lib/backConfigs';
import {Routes_Back} from '@/lib/enums/Routes';
import {LoadingOutlined} from '@ant-design/icons';
import {Spin} from 'antd';
import {useRouter} from 'next/router';
import {useCallback, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {prettifyRut} from 'react-rut-formatter';
import {apiPut} from '@/lib/api';
import {useAppContext} from '@/lib/AppContext';
import {Colors} from '@/lib/enums/Colors';
import {ThemePrincipalButton} from '@/lib/enums/ThemeConfigProvider';
import {TypeHtmlType} from '@/lib/enums/TypeHtmlType';
import {validationRules} from '@/lib/enums/ValidationRules';
import {formatRut} from '@/lib/functions';
import ButtonG from '@/components/Buttons/ButtonG';
import RifaLogo from '@/components/Logos/RifaLogo';
import ErrorMessageModal from '@/components/Modals/Contents/ErrorMessageModal';
import InputDate from '@/components/Forms/Inputs/InputDate';
import InputPassword from '@/components/Forms/Inputs/InputPassword';
import InputText from '@/components/Forms/Inputs/InputText';
import LabeledInput from '@/components/Forms/Label/LabeledInput';
import {identify, track} from '@/lib/segment';
import {Events} from '@/lib/enums/Events';

const RegisterForm = ({mailAuthTkn}: any) => {
  const {setCurrentModalContet, setLogged, setUserData} = useAppContext();
  const route = useRouter();
  const [loading, setLoading] = useState(false);
  const _id = localStorage.getItem('_id');

  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm({
    defaultValues: {
      fullName: '',
      identificationFull: '',
      birthday: '',
      phone: '',
      password: '',
      confirmPassword: '',
      rut: '',
    },
  });

  const catchUserSignup = ({
    _id,
    fullName,
    birthday,
    identificationFull,
    phone,
    isFinishedSuscription,
    finishedSuscriptionAt,
  }: any) => {
    identify(_id, {
      fullName,
      birthday,
      identificationFull,
      phone,
      isFinishedSuscription,
      finishedSuscriptionAt,
    });
    track(Events.USER_SIGNUP, {
      _id,
      fullName,
      birthday,
      identificationFull,
      phone,
      isFinishedSuscription,
      finishedSuscriptionAt,
    });
  };

  const passwordValue = watch('password');
  const onSubmit = useCallback(async (data: any) => {
    setLoading(true);

    const {identificationFull, phone, ...newData} = data;
    const updatePhone = parseInt(phone);
    const formatedRut = formatRut(identificationFull);

    const {data: response, error} = await apiPut(
      `${url_back}${Routes_Back.USERS.INDEX}${Routes_Back.USERS.SIGNUP}`,
      {...newData, phone: updatePhone, identificationFull: formatedRut},
      auth_header({aut_token: mailAuthTkn})
    );
    if (response) {
      const {
        _id,
        token,
        birthday,
        email,
        isFinishedSuscription,
        finishedSuscriptionAt,
        fullName,
        identificationFull,
        plan,
        phone,
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
      catchUserSignup({
        _id,
        fullName,
        birthday,
        identificationFull,
        phone,
        isFinishedSuscription,
        finishedSuscriptionAt,
      });
      setUserData(userDataObjt);

      setTimeout(() => {
        setLogged(true);
        route.push('/dashboard');
      }, 1000);
    } else {
      setCurrentModalContet(
        <ErrorMessageModal
          title={'¡Algo salió mal!'}
          paragraph={'No pudimos guardar tu información... Vuelve a intentarlo más tarde.'}
        />
      );
    }
    setLoading(false);
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="auth-card register-form-container">
        <div className="auth-card-header">
          <RifaLogo color={Colors.PRINCIPAL_COLOR} />
          <span className="subtitle">Desbloquea tu acceso exclusivo</span>
        </div>
        <LabeledInput label={'Nombre completo'} required={true} error={errors.fullName}>
          <Controller
            name="fullName"
            control={control}
            rules={validationRules.fullName}
            render={({field}) => (
              <InputText placeHolder={'Ingrese su nombre completo'} {...field} />
            )}
          />
        </LabeledInput>
        <LabeledInput label={'Rut'} required={true} error={errors.rut}>
          <Controller
            name="identificationFull"
            control={control}
            rules={validationRules.rut}
            render={({field}) => (
              <InputText
                placeHolder={'Ingrese su rut'}
                {...field}
                onChange={(e: {target: {value: string | null}}) => {
                  field.onChange(prettifyRut(e.target.value));
                }}
              />
            )}
          />
        </LabeledInput>
        <LabeledInput label={'Fecha de nacimiento'} required={true} error={errors.birthday}>
          <Controller
            name="birthday"
            control={control}
            rules={validationRules.birthday}
            render={({field}) => (
              <InputDate placeHolder={'Ingrese su fecha de nacimiento'} {...field} />
            )}
          />
        </LabeledInput>
        <LabeledInput label={'Teléfono'} required={true} error={errors.phone}>
          <Controller
            name="phone"
            control={control}
            rules={validationRules.phone}
            render={({field}) => (
              <InputText placeHolder={'Ingrese su número de teléfono'} {...field} />
            )}
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
    </>
  );
};
export default RegisterForm;
