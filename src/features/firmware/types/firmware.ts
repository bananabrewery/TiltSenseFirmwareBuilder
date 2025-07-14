import type { Tilt } from '@/features/configuration/types/tilt.ts';
import { configConstants } from '@/constants/firmware.ts';

export interface BrewfatherOptions {
  enabled: boolean;
  apiKey: string;
}

export interface WifiConfig {
  SSID: string;
  password: string;
}

export interface FirmwareOptions {
  name: string;
  friendlyName: string;
  brewfather: BrewfatherOptions;
  ha: boolean;
  wifiConfig: WifiConfig;
  enablePressureSensors: boolean;
  isMax: boolean;
  email?: string;
  fileName: string;
  isBeta: boolean;
}

export interface FirmwareContext {
  tilts: Tilt[];
  firmwareOptions: FirmwareOptions;
  configConstants: typeof configConstants;
}
