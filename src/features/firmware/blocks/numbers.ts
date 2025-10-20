import type { Tilt } from '@/features/configuration/types/tilt.ts';
import type { FirmwareContext } from '@/features/firmware/types/firmware.ts';

export function generateNumberBlock(context: FirmwareContext): string {
  const { configConstants } = context;
  const lines: string[] = [`number:`];

  context.tilts.forEach((tilt: Tilt) => {
    lines.push(
      `  platform: template`,
      `  name: '${context.firmwareOptions.friendlyName} Gravity Offset'`,
      `  id: number_gravity_offset_${tilt.color.colorKey}`,
      `  min_value: -${configConstants.maxOffset}`,
      `  max_value: ${configConstants.maxOffset}`,
      `  step: 1`,
      `  optimistic: true`,
      `  initial_value: 0`,
      `  restore_value: true`,
      `  entity_category: diagnostic`,
      `  set_action:`,
      `    - lambda: |-`,
      `        id(gravity_offset_black) = (int)x;`
    );
  });

  lines.push('');

  return lines.join('\n');
}
