import type {Tilt} from "@/models/tilt.ts";

export function generateGlobalsBlock(tilts: Tilt[]): string {
    let globalsBlock = `globals:
  - id: last_ble_update
    type: unsigned long
    restore_value: no
    initial_value: '0'
  - id: last_touch_time
    type: unsigned long
    restore_value: no
    initial_value: '0'
  - id: screen_dimmed
    type: bool
    restore_value: no
    initial_value: 'false'
  - id: last_touch_x
    type: int
    initial_value: '0'
  - id: last_touch_y
    type: int
    initial_value: '0'
  - id: current_page
    type: int
    restore_value: no
    initial_value: '0'`;

    tilts.forEach((tilt: Tilt) => {
        globalsBlock += `
  - id: enable_tilt_${tilt.color.colorKey}
    type: bool
    restore_value: true
    initial_value: 'true'`;
    });

    globalsBlock += `
  
`;

    return globalsBlock;
}