import type { Tilt } from '@/features/configuration/types/tilt.ts';
import type { FirmwareContext } from '@/features/firmware/types/firmware.ts';

export function generateSwitchesBlock(context: FirmwareContext): string {
  const lines: string[] = [`switch:`];

  context.tilts.forEach((tilt: Tilt) => {
    const key = tilt.color.colorKey;
    const name = tilt.color.name;
    const colorHex = tilt.color.displayColor.slice(1); // Remove #

    lines.push(
      `  - platform: template`,
      `    name: "Enable Tilt ${name}"`,
      `    id: switch_enable_tilt_${key}`,
      `    optimistic: true`,
      `    restore_mode: RESTORE_DEFAULT_ON`,
      `    turn_on_action:`,
      `      - lvgl.arc.update:`,
      `          id: border_circle_${key}`,
      `          arc_color: 0x${colorHex}`,
      `      - lambda: |-`,
      `          id(enable_tilt_${key}) = true;`,
      `    turn_off_action:`,
      `      - lvgl.arc.update:`,
      `          id: border_circle_${key}`,
      `          arc_color: 0x808080`,
      `      - lambda: |-`,
      `          id(enable_tilt_${key}) = false;`,
      `      - sensor.template.publish:`,
      `          id: tilt_gravity_${key}`,
      `          state: !lambda 'return NAN;'`,
      `      - sensor.template.publish:`,
      `          id: tilt_temperature_${key}`,
      `          state: !lambda 'return NAN;'`,
      `      - lvgl.label.update:`,
      `          id: ble_gravity_label_${key}`,
      `          text: " "`,
      `      - lvgl.label.update:`,
      `          id: ble_temp_label_${key}`,
      `          text: " "`,
      `    lambda: |-`,
      `      return id(enable_tilt_${key});`
    );
  });

  lines.push('');

  return lines.join('\n');
}
