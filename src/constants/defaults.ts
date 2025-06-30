import type { FirmwareOptions } from '@/types/firmware';
import type { Tilt, TiltColorKey } from '@/models/tilt';
import { TiltColorId, TiltColorKeys, TiltColorsDisplay, TiltColorsHex } from '@/models/tilt';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const defaultFirmwareOptions: FirmwareOptions = {
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
  fileName: 'tiltsense.yaml',
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
