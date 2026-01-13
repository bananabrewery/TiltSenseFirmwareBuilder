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
    `          struct TiltUI {`,
    `            bool* enabled;`,
    `            esphome::switch_::Switch* toggle;`,
    `            esphome::lvgl::LvPageType* page;`,
    `          };`,
    `          TiltUI tilts[] = {`,
  ];

  tilts.forEach((tilt) => {
    const key = tilt.color.colorKey;
    lines.push(
      `            { &id(enable_tilt_${key}), id(switch_enable_tilt_${key}), id(display_${key}) },`
    );
  });

  lines.push(
    `          };`,
    `          const int TILT_COUNT = sizeof(tilts) / sizeof(tilts[0]);`,
    `          int page = id(current_page);`,
    `          if (id(last_touch_y) > ${bottomScreenThreshold}) {`,
    `            auto &t = tilts[page];`,
    `            if (*t.enabled) t.toggle->turn_off();`,
    `            else t.toggle->turn_on();`,
    `            return;`,
    `          }`,
    `          if (id(last_touch_x) < ${swipeLeftThreshold} && page > 0) {`,
    `            page--;`,
    `            id(current_page) = page;`,
    `            lv_scr_load_anim(tilts[page].page->obj, LV_SCR_LOAD_ANIM_MOVE_RIGHT, ${configConstants.animationTime}, 0, false);`,
    `            return;`,
    `          }`,
    `          if (id(last_touch_x) > ${swipeRightThreshold} && page < TILT_COUNT - 1) {`,
    `            page++;`,
    `            id(current_page) = page;`,
    `            lv_scr_load_anim(tilts[page].page->obj, LV_SCR_LOAD_ANIM_MOVE_LEFT, ${configConstants.animationTime}, 0, false);`,
    `            return;`,
    `          }`
  );

  lines.push('');

  return lines.join('\n');
}
