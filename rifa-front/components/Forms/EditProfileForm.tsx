/* eslint-disable react/no-children-prop */
import {auth_header, url_back} from '@/lib/backConfigs';
import {Routes, Routes_Back} from '@/lib/enums/Routes';
import {LoadingOutlined} from '@ant-design/icons';
import {Spin} from 'antd';
import {useRouter} from 'next/router';
import {useCallback, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {MdOutlineModeEdit} from 'react-icons/md';
import {apiPut} from '@/lib/api';
import {useAppContext} from '@/lib/AppContext';
import {Colors} from '@/lib/enums/Colors';
import {ThemePrincipalButton} from '@/lib/enums/ThemeConfigProvider';
import {TypeHtmlType} from '@/lib/enums/TypeHtmlType';
import {validationRules} from '@/lib/enums/ValidationRules';
import ButtonG from '@/components/Buttons/ButtonG';
import {Icons} from '@/components/Icons/Icons';
import ErrorMessageModal from '@/components/Modals/Contents/ErrorMessageModal';
import ModalComponent from '@/components/Modals/ModalComponent';
import InputDate from '@/components/Forms/Inputs/InputDate';
import InputText from '@/components/Forms/Inputs/InputText';
import LabeledInput from '@/components/Forms/Label/LabeledInput';

const EditProfileForm = ({mailAuthTkn}: any) => {
  const {setCurrentModalContet, setLogged, setUserData, userData} = useAppContext();
  const route = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm({
    defaultValues: {
      fullName: userData?.fullName,
      birthday: userData?.birthday,
      phone: userData?.phone,
    },
  });

  const onSubmit = useCallback(async (data: any) => {
    setLoading(true);

    const {phone, ...objtData} = data;
    const updatePhone = parseInt(phone);

    const {data: response, error} = await apiPut(
      `${url_back}${Routes_Back.USERS.INDEX}${Routes_Back.USERS.EDIT_PROFILE}`,
      {phone: updatePhone, ...objtData},
      auth_header({aut_token: mailAuthTkn})
    );

    if (response) {
      const {token, ...responseData} = response;

      localStorage.setItem('user-token', token);

      const newData = {
        fullName: responseData.fullName ? responseData.fullName : userData.fullName,
        phone: responseData.phone ? responseData.phone : userData.phone,
        birthday: responseData.birthday ? responseData.birthday : userData.birthday,
      };
      const {fullName, phone, birthday, ...nonModifiableData} = userData;
      const userUpdateData = {...nonModifiableData, ...newData};

      setUserData(userUpdateData);
      route.push(`${Routes.DASHBOARD.INDEX}`);
      setCurrentModalContet(
        <ModalComponent>
          <>
            {Icons.CHECKMARK}
            <p>¡Tus datos fueron actualizados exitosamente!</p>
          </>
        </ModalComponent>
      );
      setTimeout(() => {
        setCurrentModalContet(null);
      }, 5000);
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
        <div className="column-component edit-profile-form-header">
          <h3>Editar perfil</h3>
          <div className="edit-profile-form-img"></div>
          <div className="row-component generic-label">
            <MdOutlineModeEdit />
            <span>Cambiar imagen</span>
          </div>
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
                  Editar perfil
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

export default EditProfileForm;
