import type {Tilt} from "@/models/tilt.ts";

export function generateSwitchesBlock(tilts: Tilt[]): string {
    let switchesBlock = `switch:`;
    tilts.forEach((tilt: Tilt) => {
        switchesBlock += `
  - platform: template
    name: "Enable Tilt ${tilt.color.name}"
    id: switch_enable_tilt_${tilt.color.colorKey}
    optimistic: true
    restore_mode: RESTORE_DEFAULT_ON
    turn_on_action:
      - lvgl.arc.update:
          id: border_circle_${tilt.color.colorKey}
          arc_color: 0x${tilt.color.displayColor.slice(1)}
      - lambda: |-
          id(enable_tilt_${tilt.color.colorKey}) = true;
    turn_off_action:
      - lvgl.arc.update:
          id: border_circle_${tilt.color.colorKey}
          arc_color: 0x808080
      - lambda: |-
          id(enable_tilt_${tilt.color.colorKey}) = false;
      - sensor.template.publish:
          id: tilt_gravity_${tilt.color.colorKey}
          state: 0.0
      - sensor.template.publish:
          id: tilt_temperature_${tilt.color.colorKey}
          state: 0.0
      - lvgl.label.update:
          id: ble_gravity_label_${tilt.color.colorKey}
          text: " "
      - lvgl.label.update:
          id: ble_temp_label_${tilt.color.colorKey}
          text: " "
    lambda: |-
      return id(enable_tilt_${tilt.color.colorKey});`;
    });

    switchesBlock += `
  
`;

    return switchesBlock;
}