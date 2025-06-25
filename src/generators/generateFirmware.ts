import { type Tilt } from '@/models/tilt';
import { type FirmwareOptions } from '@/types/firmware';
import { generateBaseConfigBlock } from '@/generators/blocks/base';
import { generateGlobalsBlock } from '@/generators/blocks/globals';
import { generateBLEBlock } from '@/generators/blocks/ble';
import { generateSwitchesBlock } from '@/generators/blocks/switches';
import { generateSensorsBlock } from '@/generators/blocks/sensors';
import { generateHardwareBlock } from '@/generators/blocks/hardware';
import { generateIntervalsBlock } from '@/generators/blocks/intervals';
import { generateScriptsBlock } from '@/generators/blocks/scripts';
import { generateLVGLBlock } from '@/generators/blocks/lvgl';
import { configConstants } from '@/constants/firmware';

export function generateFirmwareConfig(tilts: Tilt[], firmwareOptions: FirmwareOptions): string {
  let tiltSenseGeneratedFirmware: string = generateBaseConfigBlock(
    configConstants,
    firmwareOptions
  );
  tiltSenseGeneratedFirmware += generateGlobalsBlock(tilts);
  tiltSenseGeneratedFirmware += generateBLEBlock(tilts);
  tiltSenseGeneratedFirmware += generateSwitchesBlock(tilts);
  tiltSenseGeneratedFirmware += generateSensorsBlock(tilts, configConstants, firmwareOptions);
  tiltSenseGeneratedFirmware += generateHardwareBlock(configConstants);
  tiltSenseGeneratedFirmware += generateIntervalsBlock(tilts, firmwareOptions, configConstants);
  tiltSenseGeneratedFirmware += generateScriptsBlock(tilts, configConstants);
  tiltSenseGeneratedFirmware += generateLVGLBlock(tilts);
  return tiltSenseGeneratedFirmware;
}
