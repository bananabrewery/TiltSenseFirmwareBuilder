import React from 'react';
import { useAppContext } from '@/context/useAppContext';
import type { Tilt } from '@/models/tilt.ts';
import { EnabledTiltItem } from '@/components/configuration/EnabledTiltItem.tsx';

export const EnabledTiltList: React.FC = () => {
  const { tilts, tiltHandlers } = useAppContext();

  const handleTiltChange = (key: string, field: keyof Tilt, value: string) => {
    const index = tilts.findIndex((t) => t.key === key);
    if (index !== -1) {
      tiltHandlers.setItemProp(index, field, value);
    }
  };

  return (
    <>
      {tilts
        .filter((tilt) => tilt.enabled)
        .map((tilt) => (
          <EnabledTiltItem key={tilt.key} tilt={tilt} onChange={handleTiltChange} />
        ))}
    </>
  );
};
