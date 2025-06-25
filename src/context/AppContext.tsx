import { createContext } from 'react';
import type { FirmwareOptions } from '@/types/firmware';

export type AppContextType = {
  firmwareOptions: FirmwareOptions;
  setFirmwareOptions: React.Dispatch<React.SetStateAction<FirmwareOptions>>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);
