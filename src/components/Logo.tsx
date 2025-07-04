import Icon from '@/assets/logo.svg?react';
import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
}

export const Logo: React.FC<LogoProps> = ({ width = 120, height = 120 }) => {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  return (
    <Icon
      width={width}
      height={height}
      style={{
        color: isDark ? 'white' : 'black',
      }}
    />
  );
};
