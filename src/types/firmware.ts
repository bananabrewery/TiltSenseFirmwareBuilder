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
}
