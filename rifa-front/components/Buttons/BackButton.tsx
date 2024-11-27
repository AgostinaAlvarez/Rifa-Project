import React from 'react';
import {IoArrowBackOutline} from 'react-icons/io5';

const BackButton = ({handleBack}: any) => {
  return (
    <div className="container-back" onClick={handleBack}>
      <IoArrowBackOutline />
      <span className="content-back">Volver</span>
    </div>
  );
};
export default BackButton;
