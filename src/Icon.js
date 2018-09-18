import React from 'react';

const Icon = ({icon, size, className = '', style = {}, ...props}) => (
  <i 
    className={`material-icons ${className}`}
    style={{fontSize: size, ...style}}
    {...props}>
    {icon}
  </i>
);

export default Icon;
