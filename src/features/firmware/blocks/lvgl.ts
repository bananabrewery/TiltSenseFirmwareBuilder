import type { Tilt } from '@/features/configuration/types/tilt.ts';
import type { FirmwareContext } from '@/features/firmware/types/firmware.ts';
import { getTiltPage } from '@/features/firmware/blocks/devices/common.ts';

export function generateLVGLBlock(context: FirmwareContext): string {
  const lines: string[] = [
    `lvgl:`,
    `  id: lvgl_id`,
    `  displays:`,
    `    - lcd_display`,
    `  touchscreens:`,
    `    - tiltsense_touchscreen`,
    `  pages:`,
  ];

  context.tilts.forEach((tilt: Tilt) => {
    lines.push(...getTiltPage(tilt, context));
  });

  return lines.join('\n');
}
