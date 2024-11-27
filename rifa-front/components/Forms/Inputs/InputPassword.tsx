import React from 'react';
import {Input} from 'antd';

const InputPassword = ({placeHolder, value, onChange}: any) => {
  return (
    <Input.Password
      placeholder={placeHolder}
      value={value}
      onChange={onChange}
      className="generic-input"
    />
  );
};

export default InputPassword;
