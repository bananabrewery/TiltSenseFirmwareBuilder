import type { ReactNode } from 'react';
import { useState } from 'react';
import { AppContext } from '@/context/AppContext';
import type { FirmwareOptions } from '@/types/firmware';

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

  return (
    <AppContext.Provider value={{ firmwareOptions, setFirmwareOptions }}>
      {children}
    </AppContext.Provider>
  );
};
