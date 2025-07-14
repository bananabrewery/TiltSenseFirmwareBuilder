import { generateBaseConfigBlock } from '@/features/firmware/blocks/base.ts';
import { generateGlobalsBlock } from '@/features/firmware/blocks/globals.ts';
import { generateBLEBlock } from '@/features/firmware/blocks/ble.ts';
import { generateSwitchesBlock } from '@/features/firmware/blocks/switches.ts';
import { generateSensorsBlock } from '@/features/firmware/blocks/sensors.ts';
import { generateHardwareBlock } from '@/features/firmware/blocks/hardware.ts';
import { generateIntervalsBlock } from '@/features/firmware/blocks/intervals.ts';
import { generateScriptsBlock } from '@/features/firmware/blocks/scripts.ts';
import { generateLVGLBlock } from '@/features/firmware/blocks/lvgl.ts';
import type { FirmwareContext } from '@/features/firmware/types/firmware.ts';

export function generateFirmwareConfig(context: FirmwareContext): string {
  console.log(context);
  const blocks: string[] = [
    generateBaseConfigBlock(context),
    generateHardwareBlock(context),
    generateGlobalsBlock(context),
    generateBLEBlock(context),
    generateSwitchesBlock(context),
    generateSensorsBlock(context),
    generateIntervalsBlock(context),
    generateScriptsBlock(context),
    generateLVGLBlock(context),
  ];
  return blocks.join('\n');
}
