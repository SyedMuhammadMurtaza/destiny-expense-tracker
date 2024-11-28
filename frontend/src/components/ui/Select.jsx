// src/components/ui/Select.jsx
import React from 'react';

const Select = ({ children, value, onChange, disabled, className = '', ...props }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;
