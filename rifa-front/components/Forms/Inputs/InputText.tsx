import React from 'react';
import {Input} from 'antd';

const InputText = ({placeHolder, value, onChange}: any) => (
  <Input placeholder={placeHolder} value={value} onChange={onChange} className="generic-input" />
);

export default InputText;
