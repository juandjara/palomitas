import React from 'react';

const Icon = ({icon, size, className = '', style = {}, onClick, role, tabIndex}) => (
  <i 
    className={`material-icons ${className}`}
    style={{fontSize: size, ...style}}
    onClick={onClick}
    role={role}
    tabIndex={tabIndex}>
    {icon}
  </i>
);

export default Icon;
