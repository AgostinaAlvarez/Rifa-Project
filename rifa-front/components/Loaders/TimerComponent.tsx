/* eslint-disable react/no-children-prop */
import {LoadingOutlined} from '@ant-design/icons';
import {Spin} from 'antd';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {useAppContext} from '@/lib/AppContext';
import {Colors} from '@/lib/enums/Colors';
import {ThemePrincipalButton} from '@/lib/enums/ThemeConfigProvider';
import ButtonG from '@/components/Buttons/ButtonG';

const TimerComponent = ({redirectUrl, handleClick}: any) => {
  const {setCurrentModalContet} = useAppContext();
  const route = useRouter();

  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      setCurrentModalContet(null);
      route.push(redirectUrl);
    }
  }, [seconds]);

  return (
    <div className="row-component timer-component-container">
      <ButtonG
        htmlType={'button'}
        theme={ThemePrincipalButton}
        children={
          <span className="generic-text" style={{color: Colors.BLACK}}>
            Continuar
          </span>
        }
        handleClick={handleClick}
        className={undefined}
        type={undefined}
        block={undefined}
        disable={undefined}
        style={undefined}
      />
      <div className="row-component">
        <Spin size="default" indicator={<LoadingOutlined spin />} />
        <span
          className="generic-text login-label forgot-password-text"
          style={{color: Colors.WHITE}}
        >
          En {seconds} segundos serás redirigido a suscribirme
        </span>
      </div>
    </div>
  );
};

export default TimerComponent;
