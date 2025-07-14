import type { FirmwareContext } from '@/features/firmware/types/firmware.ts';
import { getHardware } from '@/features/firmware/blocks/devices/common.ts';

export function generateHardwareBlock(context: FirmwareContext): string {
  const { friendlyName } = context.firmwareOptions;
  const baseLines = getHardware(context);
  const lines = [...baseLines];

  lines.push(
    `light:`,
    `  - platform: monochromatic`,
    `    output: backlight_output`,
    `    name: "${friendlyName} Display Backlight"`,
    `    id: led`,
    `    restore_mode: ALWAYS_ON`,
    `    internal: True`,
    ``
  );

  return lines.join('\n');
}
