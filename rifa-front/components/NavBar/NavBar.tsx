import {useState} from 'react';
import {MdOutlineClose, MdOutlineMenu} from 'react-icons/md';
import {Colors} from '@/lib/enums/Colors';
import WordMark from '@/components/Logos/WordMark';
import MobileMenu from '@/components/NavBar/MobileMenu';

const NavBar = ({optionsNavBar, buttonContainer}: any) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav>
      <div className="nav-bar-container">
        <WordMark color={Colors.WHITE} label={<span className="subtitle">RifaClub</span>} />
        <div className="nav-bar-desktop">{optionsNavBar}</div>
        <div className="nav-bar-desktop">{buttonContainer}</div>
        <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <MdOutlineClose /> : <MdOutlineMenu />}
        </div>
      </div>
      <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
    </nav>
  );
};

export default NavBar;
