import React from 'react';
import { useAppContext } from '@/context/useAppContext.ts';
import type { Tilt } from '@/features/configuration/types/tilt.ts';
import { EnabledTiltItem } from '@/features/configuration/components/stepper/EnabledTiltItem.tsx';

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
