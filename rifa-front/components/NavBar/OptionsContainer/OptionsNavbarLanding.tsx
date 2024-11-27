import React from 'react';
import Link from 'next/link';

const OptionsNavbarLanding = () => {
  return (
    <ul className="row-component nav-bar-suboptions">
      <li className="nav-text">
        <Link href="/#homepage" className="nav-text">
          Inicio
        </Link>
      </li>
      <li className="nav-text">
        <Link href="/#main-awards" className="nav-text">
          Sorteos
        </Link>
      </li>
    </ul>
  );
};

export default OptionsNavbarLanding;
