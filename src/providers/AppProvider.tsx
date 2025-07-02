import { type ReactNode, useEffect, useState } from 'react';
import { AppContext } from '@/context/AppContext';
import type { FirmwareOptions } from '@/types/firmware';
import { type Tilt } from '@/models/tilt';
import { loadPersistedState, savePersistedState } from '@/utils/storage';
import { defaultFirmwareOptions, defaultTilts } from '@/constants/defaults';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const persisted = loadPersistedState();

  const [firmwareOptions, setFirmwareOptions] = useState<FirmwareOptions>(
    persisted?.firmwareOptions ?? defaultFirmwareOptions
  );

  const [tilts, setTilts] = useState<Tilt[]>(persisted?.tilts ?? defaultTilts);
  const [yamlContent, setYamlContent] = useState<string>('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      savePersistedState({ firmwareOptions, tilts });
      setYamlContent('');
    }, 1000);

    return () => clearTimeout(timeout);
  }, [firmwareOptions, tilts]);

  return (
    <AppContext.Provider
      value={{ firmwareOptions, setFirmwareOptions, tilts, setTilts, yamlContent, setYamlContent }}
    >
      {children}
    </AppContext.Provider>
  );
};
