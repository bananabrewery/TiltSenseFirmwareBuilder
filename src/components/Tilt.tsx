import Icon from '@/assets/tilt.svg?react';
import React from 'react';

interface IconTiltProps {
  width?: number;
  height?: number;
  color?: string;
}

export const IconTilt: React.FC<IconTiltProps> = ({ width = 150, height = 150, color }) => {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const defaultColor = isDark ? 'white' : 'black';
  return (
    <Icon
      width={width}
      height={height}
      style={{
        color: color ? color : defaultColor,
      }}
    />
  );
};
