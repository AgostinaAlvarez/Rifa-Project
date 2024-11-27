import {useRouter} from 'next/router';
import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {ConfigProps} from '@/types/index';
import {MarketingKeys} from '@/lib/enums/MarketingKeys';
import {camelCase} from '@/lib/functions';

interface ContextProps {
  actionButton: (action?: string) => void;
  configData: ConfigProps;
  utmCampaingMKT: Record<string, string>;
  userData: any;
  setUserData: any;
  logged: boolean;
  setLogged: any;
  currentModalContent: any;
  setCurrentModalContet: any;
}

interface AppProviderProps {
  children: ReactNode;
  configData: ConfigProps;
}

const AppContext = createContext({} as ContextProps);

export const useAppContext = () => useContext(AppContext);

const AppProvider = ({children, configData}: AppProviderProps) => {
  const router = useRouter();
  const [utmCampaingMKT, setUtmCampaingMKT] = useState<Record<string, string>>({});
  const [userData, setUserData] = useState(null);
  const [logged, setLogged] = useState(false);
  const [currentModalContent, setCurrentModalContet] = useState(null);

  const actionButton = (action: string = '/') => {
    if (action?.includes('http')) {
      window.open(action, '_blank', 'noopener,noreferrer');
    } else {
      router.push(action);
    }
  };

  useEffect(() => {
    const campaignMKT: Record<string, string> = {};
    Object.entries(router.query).forEach(([key, value]: any) => {
      if (Object.values(MarketingKeys).includes(key)) campaignMKT[camelCase(key)] = value;
    });
    setUtmCampaingMKT({...campaignMKT});
  }, []);

  return (
    <AppContext.Provider
      value={{
        actionButton,
        configData,
        utmCampaingMKT,
        userData,
        setUserData,
        logged,
        setLogged,
        currentModalContent,
        setCurrentModalContet,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
