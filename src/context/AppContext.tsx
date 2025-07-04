import React, { createContext } from 'react';
import type { FirmwareOptions } from '@/features/firmware/types/firmware.ts';
import type { Tilt } from '@/features/configuration/types/tilt.ts';
import type { UseListStateHandlers } from '@mantine/hooks';

export type AppContextType = {
  firmwareOptions: FirmwareOptions;
  setFirmwareOptions: React.Dispatch<React.SetStateAction<FirmwareOptions>>;
  tilts: Tilt[];
  tiltHandlers: UseListStateHandlers<Tilt>;
  yamlContent: string;
  setYamlContent: React.Dispatch<React.SetStateAction<string>>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);
