import type { FirmwareContext } from '@/features/firmware/types/firmware.ts';
import { getDeviceConstants } from '@/features/firmware/blocks/devices/common.ts';

export function generateScriptsBlock(context: FirmwareContext): string {
  const { configConstants, tilts } = context;
  const { bottomScreenThreshold, swipeLeftThreshold, swipeRightThreshold } =
    getDeviceConstants(context);

  const lines: string[] = [
    `script:`,
    `  - id: handle_touch`,
    `    mode: restart`,
    `    then:`,
    `      - lambda: |-`,
    `          id(last_touch_time) = millis();`,
    `      - if:`,
    `          condition:`,
    `            lambda: 'return id(screen_dimmed);'`,
    `          then:`,
    `            - light.turn_on:`,
    `                id: led`,
    `                brightness: 100%`,
    `            - lambda: 'id(screen_dimmed) = false;'`,
    `          else:`,
    `            - if:`,
    `                condition:`,
    `                  lambda: 'return id(last_touch_y) > ${bottomScreenThreshold};'`,
    `                then:`,
    `                  - lambda: |-`,
  ];

  tilts.forEach((tilt, index) => {
    const key = tilt.color.colorKey;
    const block = [
      `${index === 0 ? `                            if` : `                            else if`} (id(current_page) == ${index}) {`,
      `                              if (id(enable_tilt_${key})) {`,
      `                                id(switch_enable_tilt_${key}).turn_off();`,
      `                              } else {`,
      `                                id(switch_enable_tilt_${key}).turn_on();`,
      `                              }`,
      `                            }`,
    ];
    lines.push(...block);
  });

  lines.push(
    `            - if:`,
    `                condition:`,
    `                  lambda: 'return id(last_touch_x) < ${swipeLeftThreshold} && id(current_page) > 0;'`,
    `                then:`,
    `                  - lambda: |-`,
    `                      id(current_page) -= 1;`
  );

  tilts.forEach((tilt, i) => {
    lines.push(
      `                  - if:`,
      `                      condition:`,
      `                        lambda: 'return id(current_page) == ${i};'`,
      `                      then:`,
      `                        - lvgl.page.show:`,
      `                            id: display_${tilt.color.colorKey}`,
      `                            animation: MOVE_RIGHT`,
      `                            time: ${configConstants.animationTime}`
    );
  });

  lines.push(
    `            - if:`,
    `                condition:`,
    `                  lambda: 'return id(last_touch_x) > ${swipeRightThreshold} && id(current_page) < ${tilts.length - 1};'`,
    `                then:`,
    `                  - lambda: |-`,
    `                      id(current_page) += 1;`
  );

  tilts.forEach((tilt, i) => {
    lines.push(
      `                  - if:`,
      `                      condition:`,
      `                        lambda: 'return id(current_page) == ${i};'`,
      `                      then:`,
      `                        - lvgl.page.show:`,
      `                            id: display_${tilt.color.colorKey}`,
      `                            animation: MOVE_LEFT`,
      `                            time: ${configConstants.animationTime}`
    );
  });

  lines.push('');

  return lines.join('\n');
}
