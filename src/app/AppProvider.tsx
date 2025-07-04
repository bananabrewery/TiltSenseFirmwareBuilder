import { type ReactNode, useEffect, useState } from 'react';
import { AppContext } from '@/context/AppContext.tsx';
import type { FirmwareOptions } from '@/features/firmware/types/firmware.ts';
import { type Tilt } from '@/features/configuration/types/tilt.ts';
import { loadPersistedState, savePersistedState } from '@/utils/storage.ts';
import { defaultFirmwareOptions, defaultTilts } from '@/constants/defaults.ts';
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
