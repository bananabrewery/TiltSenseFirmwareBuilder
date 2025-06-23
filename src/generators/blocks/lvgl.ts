import type { Tilt } from '@/models/tilt.ts'

export function generateLVGLBlock(tilts: Tilt[]): string {
  let lvglBlock = `lvgl:
  id: lvgl_id
  displays:
    - lcd_display
  touchscreens:
    - tiltsense_touchscreen
  pages:`

  tilts.forEach((tilt: Tilt) => {
    lvglBlock += `
        - id: display_${tilt.color.colorKey}
          widgets:
            - arc:
                id: border_circle_${tilt.color.colorKey}
                align: CENTER
                arc_color: !lambda |-
                              if (id(enable_tilt_${tilt.color.colorKey})) {
                                return lv_color_hex(${tilt.color.displayColor.replace('#', '0x')});
                              } else {
                                return lv_color_hex(0x808080);
                              }
                arc_rounded: true
                arc_width: 20
                width: 220
                height: 220
            - label:
                id: ble_gravity_label_${tilt.color.colorKey}
                align: CENTER
                text: " "
                text_font: montserrat_48
                y: -35
            - label:
                id: ble_temp_label_${tilt.color.colorKey}
                align: CENTER
                text: " "
                text_font: montserrat_26
                y: 10
            - label:
                id: pressure_label_${tilt.color.colorKey}
                align: CENTER
                text: " "
                text_font: montserrat_20
                text_color: 0x707070
                y: 60
            - label:
                align: CENTER
                text: "Tilt ${tilt.color.name}"
                text_font: montserrat_16
                y: 90`
  })

  lvglBlock += `
  
`

  return lvglBlock
}
