import type {Tilt} from "../../models/tilt.ts";

export function generateScriptsBlock(tilts: Tilt[]): string {
    let scriptsBlock = `script:
  - id: handle_touch
    mode: restart
    then:
      - lambda: |-
          id(last_touch_time) = millis();
      - if:
          condition:
            lambda: 'return id(screen_dimmed);'
          then:
            - light.turn_on:
                id: led
                brightness: 100%
            - lambda: 'id(screen_dimmed) = false;'
          else:
            - if:
                condition:
                  lambda: 'return id(last_touch_y) > 220;'
                then:
                  - lambda: |-`;

    tilts.forEach((tilt: Tilt, index: number) => {
        if (index === 0) {
            scriptsBlock += `
                            if (id(current_page) == ${index}) {
                              if (id(enable_tilt_${tilt.color.colorKey})) {
                                id(switch_enable_tilt_${tilt.color.colorKey}).turn_off();
                              } else {
                                id(switch_enable_tilt_${tilt.color.colorKey}).turn_on();
                              }
                            }`;
        } else {
            scriptsBlock += ` else if (id(current_page) == ${index}) {
                              if (id(enable_tilt_${tilt.color.colorKey})) {
                                id(switch_enable_tilt_${tilt.color.colorKey}).turn_off();
                              } else {
                                id(switch_enable_tilt_${tilt.color.colorKey}).turn_on();
                              }
                            }`;
        }
    });

    scriptsBlock += `
            - if:
                condition:
                  lambda: 'return id(last_touch_x) < 60 && id(current_page) > 0;'
                then:
                  - lambda: |-
                      id(current_page) -= 1;`

    for (let i = 0; i < tilts.length; i++) {
        scriptsBlock += `
                  - if:
                      condition:
                        lambda: 'return id(current_page) == ${i};'
                      then:
                        - lvgl.page.show: 
                            id: display_${tilts[i].color.colorKey}
                            animation: MOVE_RIGHT
                            time: 200ms`;
    }

    scriptsBlock += `
            - if:
                condition:
                  lambda: 'return id(last_touch_x) > 180 && id(current_page) < ${tilts.length - 1};'
                then:
                  - lambda: |-
                      id(current_page) += 1;`

    for (let i = 0; i < tilts.length; i++) {
        scriptsBlock += ` 
                  - if:
                      condition:
                        lambda: 'return id(current_page) == ${i};'
                      then:
                        - lvgl.page.show:
                            id: display_${tilts[i].color.colorKey}
                            animation: MOVE_LEFT
                            time: 200ms`;
    }

    scriptsBlock += `
  
`;

    return scriptsBlock;
}