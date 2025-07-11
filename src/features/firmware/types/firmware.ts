import type { Tilt } from '@/features/configuration/types/tilt.ts';
import { configConstants } from '@/constants/firmware.ts';

export interface FirmwareConfig {
  isBeta: boolean;
  name: string;
  friendlyName: string;
  screenTimeout: number;
  bottomScreenThreshold: number;
  swipeLeftThreshold: number;
  swipeRightThreshold: number;
  animationTime: string;
  pressureUnits: string;
}

export interface BrewfatherOptions {
  enabled: boolean;
  apiKey: string;
}

export interface WifiConfig {
  SSID: string;
  password: string;
}

export interface FirmwareOptions {
  brewfather: BrewfatherOptions;
  ha: boolean;
  wifiConfig: WifiConfig;
  enablePressureSensors: boolean;
  fileName: string;
  email?: string;
}

export interface FirmwareContext {
  tilts: Tilt[];
  firmwareOptions: FirmwareOptions;
  configConstants: typeof configConstants;
}
