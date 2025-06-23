import { type Tilt } from '@/models/tilt.ts';
import { type FirmwareOptions } from '@/types/firmware.ts';
import { generateBaseConfigBlock } from '@/generators/blocks/base.ts';
import { generateGlobalsBlock } from '@/generators/blocks/globals.ts';
import { generateBLEBlock } from '@/generators/blocks/ble.ts';
import { generateSwitchesBlock } from '@/generators/blocks/switches.ts';
import { generateSensorsBlock } from '@/generators/blocks/sensors.ts';
import { generateHardwareBlock } from '@/generators/blocks/hardware.ts';
import { generateIntervalsBlock } from '@/generators/blocks/intervals.ts';
import { generateScriptsBlock } from '@/generators/blocks/scripts.ts';
import { generateLVGLBlock } from '@/generators/blocks/lvgl.ts';

const config = {
  isBeta: true,
  name: 'tiltsensebeta',
  friendlyName: 'TiltSenseBeta',
  screenTimeout: 120000,
  bottomScreenThreshold: 220,
  swipeLeftThreshold: 60,
  swipeRightThreshold: 180,
  animationTime: '200ms',
  pressureUnits: 'PSI',
};

export function generateFirmwareConfig(tilts: Tilt[], firmwareOptions: FirmwareOptions): string {
  let tiltSenseGeneratedFirmware: string = generateBaseConfigBlock(config, firmwareOptions);
  tiltSenseGeneratedFirmware += generateGlobalsBlock(tilts);
  tiltSenseGeneratedFirmware += generateBLEBlock(tilts);
  tiltSenseGeneratedFirmware += generateSwitchesBlock(tilts);
  tiltSenseGeneratedFirmware += generateSensorsBlock(tilts, config, firmwareOptions);
  tiltSenseGeneratedFirmware += generateHardwareBlock(config);
  tiltSenseGeneratedFirmware += generateIntervalsBlock(tilts, firmwareOptions, config);
  tiltSenseGeneratedFirmware += generateScriptsBlock(tilts, config);
  tiltSenseGeneratedFirmware += generateLVGLBlock(tilts);
  return tiltSenseGeneratedFirmware;
}
