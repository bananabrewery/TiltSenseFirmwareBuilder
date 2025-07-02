import { type ReactNode, useEffect, useState } from 'react';
import { AppContext } from '@/context/AppContext';
import type { FirmwareOptions } from '@/types/firmware';
import { type Tilt } from '@/models/tilt';
import { loadPersistedState, savePersistedState } from '@/utils/storage';
import { defaultFirmwareOptions, defaultTilts } from '@/constants/defaults';
import { useListState } from '@mantine/hooks';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const persisted = loadPersistedState();

  const [firmwareOptions, setFirmwareOptions] = useState<FirmwareOptions>(
    persisted?.firmwareOptions ?? defaultFirmwareOptions
  );

  const initialTilts: Tilt[] = persisted?.tilts ?? defaultTilts();
  const [tilts, tiltHandlers] = useListState<Tilt>(initialTilts);

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
      value={{
        firmwareOptions,
        setFirmwareOptions,
        tilts,
        tiltHandlers,
        yamlContent,
        setYamlContent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
