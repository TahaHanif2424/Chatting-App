import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>
const Input: React.FC<InputProps> = (props) => {
  const { className, ...otherProps } = props;
  return <input className={`text-gray-900 ${className || ''}`} {...otherProps} />;
};

export default Input;
