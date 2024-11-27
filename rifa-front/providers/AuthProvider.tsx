import React, {ReactNode, useEffect, useState} from 'react';
import LoadingScreen from '@/components/Loaders/LoadingScreen';
import useAuthRedirect from '@/hooks/useAuthRedirect';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const loading = useAuthRedirect();
  if (loading) {
    return (
      <LoadingScreen loading={loading} type={'FULL_SCREEN'} message={'Cargando...'}></LoadingScreen>
    );
  }
  return <>{children}</>;
};

export default AuthProvider;
