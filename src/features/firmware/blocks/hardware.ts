import type { FirmwareContext } from '@/features/firmware/types/firmware.ts';
import { tiltSenseHardware } from '@/features/firmware/blocks/devices/tiltSense/hardware.ts';
import { tiltSenseMaxHardware } from '@/features/firmware/blocks/devices/tiltSenseMax/hardware.ts';

export function generateHardwareBlock(context: FirmwareContext): string {
  const { friendlyName, isMax } = context.firmwareOptions;
  const baseLines = isMax ? tiltSenseMaxHardware : tiltSenseHardware;
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
