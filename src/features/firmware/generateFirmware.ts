import { type Tilt } from '@/features/configuration/types/tilt.ts';
import { type FirmwareOptions } from '@/features/firmware/types/firmware.ts';
import { generateBaseConfigBlock } from '@/features/firmware/blocks/base.ts';
import { generateGlobalsBlock } from '@/features/firmware/blocks/globals.ts';
import { generateBLEBlock } from '@/features/firmware/blocks/ble.ts';
import { generateSwitchesBlock } from '@/features/firmware/blocks/switches.ts';
import { generateSensorsBlock } from '@/features/firmware/blocks/sensors.ts';
import { generateHardwareBlock } from '@/features/firmware/blocks/hardware.ts';
import { generateIntervalsBlock } from '@/features/firmware/blocks/intervals.ts';
import { generateScriptsBlock } from '@/features/firmware/blocks/scripts.ts';
import { generateLVGLBlock } from '@/features/firmware/blocks/lvgl.ts';
import { configConstants } from '@/constants/firmware.ts';

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
