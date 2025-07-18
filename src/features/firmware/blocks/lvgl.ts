import type { Tilt } from '@/features/configuration/types/tilt.ts';
import type { FirmwareContext } from '@/features/firmware/types/firmware.ts';

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
    const colorKey = tilt.color.colorKey;
    const colorHex = tilt.color.displayColor.replace('#', '0x');
    const tiltLabel = `Tilt ${tilt.isPro ? 'Pro ' : ''}${tilt.color.name}`;

    lines.push(
      `        - id: display_${colorKey}`,
      `          widgets:`,
      `            - arc:`,
      `                id: border_circle_${colorKey}`,
      `                align: CENTER`,
      `                arc_color: !lambda |-`,
      `                              if (id(enable_tilt_${colorKey})) {`,
      `                                return lv_color_hex(${colorHex});`,
      `                              } else {`,
      `                                return lv_color_hex(0x808080);`,
      `                              }`,
      `                arc_rounded: true`,
      `                arc_width: 20`,
      `                width: 220`,
      `                height: 220`,
      `            - label:`,
      `                id: ble_gravity_label_${colorKey}`,
      `                align: CENTER`,
      `                text: " "`,
      `                text_font: montserrat_48`,
      `                y: -35`,
      `            - label:`,
      `                id: ble_temp_label_${colorKey}`,
      `                align: CENTER`,
      `                text: " "`,
      `                text_font: montserrat_26`,
      `                y: 10`,
      `            - label:`,
      `                id: pressure_label_${colorKey}`,
      `                align: CENTER`,
      `                text: " "`,
      `                text_font: montserrat_20`,
      `                text_color: 0x707070`,
      `                y: 60`,
      `            - label:`,
      `                align: CENTER`,
      `                text: "${tiltLabel}"`,
      `                text_font: montserrat_16`,
      `                y: 90`
    );
  });

  return lines.join('\n');
}
