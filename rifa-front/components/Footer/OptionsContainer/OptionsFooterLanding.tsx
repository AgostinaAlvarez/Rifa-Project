import React from 'react';
import Link from 'next/link';

const OptionsFooterLanding = () => {
  return (
    <div className="footer-options-container row-component">
      <span className="label footer-label">
        <Link href="/#homepage">Inicio</Link>
      </span>
      <span className="label footer-label">
        <Link href="/#main-awards">Sorteos</Link>
      </span>
    </div>
  );
};

export default OptionsFooterLanding;
