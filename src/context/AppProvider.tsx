import type { ReactNode } from 'react';
import { useState } from 'react';
import { AppContext } from '@/context/AppContext';
import type { FirmwareOptions } from '@/types/firmware';
import {
  type Tilt,
  TiltColorId,
  type TiltColorKey,
  TiltColorKeys,
  TiltColorsDisplay,
  TiltColorsHex,
} from '@/models/tilt.ts';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [firmwareOptions, setFirmwareOptions] = useState<FirmwareOptions>({
    brewfather: {
      enabled: false,
      apiKey: '',
    },
    ha: false,
    wifiConfig: {
      SSID: '',
      password: '',
    },
    enablePressureSensors: false,
  });

  const [tilts, setTilts] = useState<Tilt[]>(
    TiltColorKeys.map((colorKey) => {
      const name = capitalize(colorKey) as Capitalize<TiltColorKey>;
      return {
        key: colorKey,
        enabled: false,
        isPro: false,
        haPressureSensor: '',
        color: {
          name,
          colorKey,
          hexColor: TiltColorsHex[colorKey],
          displayColor: TiltColorsDisplay[colorKey],
          id: TiltColorId[colorKey],
        },
      };
    })
  );

  return (
    <AppContext.Provider value={{ firmwareOptions, setFirmwareOptions, tilts, setTilts }}>
      {children}
    </AppContext.Provider>
  );
};
