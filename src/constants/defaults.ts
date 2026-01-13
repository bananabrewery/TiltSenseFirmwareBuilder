import type { FirmwareOptions } from '@/features/firmware/types/firmware.ts';
import type { Tilt, TiltColorKey } from '@/features/configuration/types/tilt.ts';
import {
  TiltColorId,
  TiltColorKeys,
  TiltColorsDisplay,
  TiltColorsHex,
} from '@/features/configuration/types/tilt.ts';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const defaultFirmwareOptions: FirmwareOptions = {
  name: 'tiltsense',
  friendlyName: 'TiltSense',
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
  isMax: false,
  fileName: 'tiltsense.yaml',
  isBeta: false,
};

export const defaultTilts = (): Tilt[] =>
  TiltColorKeys.map((colorKey: TiltColorKey) => {
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
  });
