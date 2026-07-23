import React from 'react';

type ContainerSize = 'sm' | 'md' | 'lg' | 'full';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: ContainerSize;
  style?: React.CSSProperties;
}

const maxWidthStyles: Record<ContainerSize, string> = {
  sm: 'max-w-[640px]',
  md: 'max-w-[768px]',
  lg: 'max-w-[1200px]',
  full: 'max-w-[1400px]',
};

const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  size = 'lg',
  style,
}) => {
  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${maxWidthStyles[size]} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default Container;
export type { ContainerProps, ContainerSize };
