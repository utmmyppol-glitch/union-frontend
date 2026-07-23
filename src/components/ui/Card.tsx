import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  onClick,
  style,
}) => {
  const base =
    'bg-white dark:bg-[#1C1C1F] rounded-[8px] border border-[#E7E5DF] dark:border-[#2B2C30]';

  const hoverStyles = hoverable
    ? 'transition-all duration-200 hover:border-[#111214] dark:hover:border-[#93939A] cursor-pointer'
    : '';

  return (
    <div
      className={`${base} ${hoverStyles} ${className}`}
      style={style}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
};

export default Card;
export type { CardProps };
