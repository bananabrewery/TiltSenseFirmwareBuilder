import type { Tilt } from '@/features/configuration/types/tilt.ts';
import type { FirmwareContext } from '@/features/firmware/types/firmware.ts';

export function generateGlobalsBlock(context: FirmwareContext): string {
  const lines: string[] = [
    `globals:`,
    `  - id: last_ble_update`,
    `    type: unsigned long`,
    `    restore_value: no`,
    `    initial_value: '0'`,
    `  - id: last_touch_time`,
    `    type: unsigned long`,
    `    restore_value: no`,
    `    initial_value: '0'`,
    `  - id: screen_dimmed`,
    `    type: bool`,
    `    restore_value: no`,
    `    initial_value: 'false'`,
    `  - id: last_touch_x`,
    `    type: int`,
    `    initial_value: '0'`,
    `  - id: last_touch_y`,
    `    type: int`,
    `    initial_value: '0'`,
    `  - id: current_page`,
    `    type: int`,
    `    restore_value: no`,
    `    initial_value: '0'`,
  ];

  context.tilts.forEach((tilt: Tilt) => {
    lines.push(
      `  - id: enable_tilt_${tilt.color.colorKey}`,
      `    type: bool`,
      `    restore_value: true`,
      `    initial_value: 'true'`,
      `  - id: gravity_offset_${tilt.color.colorKey}`,
      `    type: int`,
      `    restore_value: true`,
      `    initial_value: '0'`
    );
  });

  lines.push('');

  return lines.join('\n');
}
