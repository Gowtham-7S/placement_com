import React from 'react';
import './Button.css';

const Button = ({
  label,
  onClick,
  variant = 'primary',
  size = 'default',
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  children,
}) => {
  const className = `button ${variant} ${size === 'small' ? 'small' : ''} ${size === 'large' ? 'large' : ''} ${fullWidth ? 'full' : ''}`;

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
    >
      {loading && <div className="button-loading" />}
      {children || label}
    </button>
  );
};

export default Button;
