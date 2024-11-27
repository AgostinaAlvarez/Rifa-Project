import {useAppContext} from '@/lib/AppContext';
import BtnContainerNavbarPrivate from '@/components/NavBar/ButtonsContainer/BtnContainerNavbarPrivate';
import BtnContainerNavbarPublic from '@/components/NavBar/ButtonsContainer/BtnContainerNavbarPublic';

import OptionsNavbarPrivate from '@/components/NavBar/OptionsContainer/OptionsNavbarPrivate';
import OptionsNavbarPublic from '@/components/NavBar/OptionsContainer/OptionsNavbarPublic';

const MobileMenu = ({isOpen, toggleMenu}: any) => {
  const {logged} = useAppContext();

  if (!isOpen) return null;

  return (
    <div className="mobile-menu">
      {logged ? (
        <div className="mobile-menu-content">
          <OptionsNavbarPrivate />
          <BtnContainerNavbarPrivate />
        </div>
      ) : (
        <div className="mobile-menu-content">
          <OptionsNavbarPublic />
          <BtnContainerNavbarPublic />
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
