import React from 'react';
import RifaLogo from '../Logos/RifaLogo';
const FooterComponent = ({color, className, optionsFooter}: any) => {
  return (
    <footer className={className}>
      <div className="footer-container">
        <div className="footer-logo-container">
          <RifaLogo height={'96'} width={'77'} color={color} />
          <span className="footer-logo-label">RifaClub</span>
        </div>
        <>{optionsFooter}</>
        <div className="footer-social-medias-container row-component">
          <div className="footer-icon-container">
            <img src="/assets/icons/Whatsapp.svg" />
          </div>
          <div className="footer-icon-container">
            <img src="/assets/icons/Instagram.svg" />
          </div>
          <div className="footer-icon-container">
            <img src="/assets/icons/Mail.svg" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
