export function generateHardwareBlock(config: any): string {
    let hardwareBlock = `psram:
  mode: quad
  speed: 80MHz

spi:
  clk_pin: GPIO10
  mosi_pin: GPIO11

output:
  - platform: ledc
    pin:
      number: GPIO02
    id: backlight_output

light:
  - platform: monochromatic
    output: backlight_output
    name: "${config.friendlyName} Display Backlight"
    id: led
    restore_mode: ALWAYS_ON
    default_transition_length: 0s
    internal: True

display:
  - platform: ili9xxx
    model: GC9A01A
    id: lcd_display
    invert_colors: true
    data_rate: 80MHz
    cs_pin: GPIO09
    dc_pin: GPIO08
    reset_pin: GPIO14
    auto_clear_enabled: false
    rotation: 0

i2c:
  sda: GPIO06
  scl: GPIO07

touchscreen:
  platform: cst816
  id: tiltsense_touchscreen
  interrupt_pin: GPIO05
  reset_pin: GPIO13
  on_touch:
    then:
      - lambda: |-
          int x = touch.x;
          int y = touch.y;

          id(last_touch_x) = x;
          id(last_touch_y) = y;
          id(handle_touch).execute();
  
`;

    return hardwareBlock;
}