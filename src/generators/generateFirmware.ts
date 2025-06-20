import {type Tilt} from '../models/Tilt';

export function generateFirmwareConfig(tilts: Tilt[], options: { brewfather: any; ha: boolean; }): any {
    console.log(options);
    const name = "tiltsensebeta";
    const friendlyName = "TiltSenseBeta"

    let tiltSenseGeneratedFirmware: string = `esphome:
  name: "${name}"
  friendly_name: "${friendlyName}"

esp32:
  board: esp32-s3-devkitc-1
  variant: esp32s3
  framework:
    type: arduino
    version: latest
  flash_size: 16MB

logger:
  level: INFO`;

    tiltSenseGeneratedFirmware += options.ha ? `

api: 
` : `
`;
    tiltSenseGeneratedFirmware += options.brewfather.enabled ? `
http_request:
  verify_ssl: False 
` : ``;

    tiltSenseGeneratedFirmware += `
ota:
  - platform: esphome

wifi:
  ap:

captive_portal:

web_server:
  port: 80
  
globals:
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
        tiltSenseGeneratedFirmware += `
  - id: enable_tilt_${tilt.color.colorKey}
    type: bool
    restore_value: true
    initial_value: 'true'`;
    });

    tiltSenseGeneratedFirmware += `

esp32_ble_tracker:
  scan_parameters:
    interval: 10000ms
    window: 1000ms
  on_ble_advertise:
    then:
      - lambda: |-
          if (x.get_ibeacon().has_value()) {
            auto ibeacon = x.get_ibeacon().value();
            std::string uuid = ibeacon.get_uuid().to_string();`;

    tilts.forEach((tilt: Tilt) => {
        if (tilt.isPro) {
            tiltSenseGeneratedFirmware += `
            if (uuid == "${tilt.color.id}" && id(enable_tilt_${tilt.color.colorKey})) {
              float temp_c = ((ibeacon.get_major() / 10.0f) - 32.0f) * 5.0f / 9.0f;
              float gravity = ibeacon.get_minor() / 10.0f;
              int rssi = x.get_rssi();
              ESP_LOGD("tilt", "[${tilt.color.name}] Temperature = %.2f °C, Gravity = %.0f, RSSI = %d", temp_c, gravity, rssi);
              id(tilt_temperature_${tilt.color.colorKey}).publish_state(temp_c);
              id(tilt_gravity_${tilt.color.colorKey}).publish_state(gravity);
            }`;
        } else {
            tiltSenseGeneratedFirmware += `
            if (uuid == "${tilt.color.id}" && id(enable_tilt_${tilt.color.colorKey})) {
              float temp_c = (ibeacon.get_major() - 32) * 5.0f / 9.0f;
              float gravity = ibeacon.get_minor();
              int rssi = x.get_rssi();
              ESP_LOGD("tilt", "[${tilt.color.name}] Temperature = %.2f °C, Gravity = %.0f, RSSI = %d", temp_c, gravity, rssi);
              id(tilt_temperature_${tilt.color.colorKey}).publish_state(temp_c);
              id(tilt_gravity_${tilt.color.colorKey}).publish_state(gravity);
            }`;
        }
    });
    tiltSenseGeneratedFirmware += `
          }
switch:`;

    tilts.forEach((tilt: Tilt) => {
        tiltSenseGeneratedFirmware += `
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

    tiltSenseGeneratedFirmware += `
    
sensor:
  - platform: internal_temperature
    name: "${friendlyName} Internal Temperature"  
  - platform: adc
    pin: GPIO01
    name: "${friendlyName} Battery Voltage"
    id: battery_voltage
    unit_of_measurement: "V"
    accuracy_decimals: 2
    device_class: voltage
    entity_category: diagnostic
    update_interval: 30s
    attenuation: auto
    filters:
      - calibrate_linear:
          - 1.49 -> 4.16
          - 1.26 -> 4.01
          - 1.20 -> 3.95
          - 1.07 -> 3.90
          - 1.04 -> 3.83
          - 1.02 -> 3.78
          - 1.00 -> 3.71
          - 0.96 -> 3.61
  - platform: template
    name: "${friendlyName} Battery Level"
    unit_of_measurement: "%"
    device_class: battery
    entity_category: diagnostic
    accuracy_decimals: 0
    lambda: |-
              float v = id(battery_voltage).state;
              float percent = 100.0 / (1.0 + exp(-10.0 * (v - 3.85)));
              if (percent > 100.0) return 100.0;
              else if (percent < 0.0) return 0.0;
              else return percent;`;

    tilts.forEach((tilt: Tilt) => {
        tiltSenseGeneratedFirmware += `
  - platform: template
    id: tilt_gravity_${tilt.color.colorKey}
    name: "Tilt ${tilt.color.name} Gravity"
    icon: "mdi:trending-down"
    accuracy_decimals: 0
    unit_of_measurement: "SG"
    update_interval: never
    on_value:
      then:
        - lvgl.label.update:
            id: ble_gravity_label_${tilt.color.colorKey}
            text: !lambda |-
                    char buffer[8];
                    snprintf(buffer, sizeof(buffer), "%.3f", id(tilt_gravity_${tilt.color.colorKey}).state / 1000.0);
                    return std::string(buffer);                    
  - platform: template
    name: "Tilt ${tilt.color.name} Temperature"
    id: tilt_temperature_${tilt.color.colorKey}
    device_class: "temperature"
    accuracy_decimals: 1
    unit_of_measurement: "°C"
    update_interval: never
    on_value:
      then:
        - lvgl.label.update:
            id: ble_temp_label_${tilt.color.colorKey}
            text: !lambda |-
                    char buffer[10];
                    snprintf(buffer, sizeof(buffer), "%.1f °C", id(tilt_temperature_${tilt.color.colorKey}).state);
                    return std::string(buffer);`;
    });


    //TODO: Review the official touch screen controller: https://esphome.io/components/touchscreen/cst816.html

    tiltSenseGeneratedFirmware += `

psram:
  mode: quad
  speed: 80MHz

external_components:
  - source: github://GadgetFactory/CST816S_touchscreen@1.0.0

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
    name: "${friendlyName} Display Backlight"
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
  
interval:
  - interval: 5s
    then:
      - lambda: |-
          unsigned long now = millis();
          if (!id(screen_dimmed) && now - id(last_touch_time) > 120000) {
            id(screen_dimmed) = true;
          }
      - if:
          condition:
            lambda: 'return id(screen_dimmed);'
          then:
            - light.turn_off:
                id: led`;

    if (options.brewfather.enabled) {
        tilts.forEach((tilt: Tilt) => {
            tiltSenseGeneratedFirmware += `  
  - interval: 15min
    then:
      - if:
          condition:
            lambda: |-
                return (
                    id(enable_tilt_${tilt.color.colorKey}) &&
                    !isnan(id(tilt_temperature_${tilt.color.colorKey}).state) &&
                    !isnan(id(tilt_gravity_${tilt.color.colorKey}).state)
                );
          then:
            - http_request.post:
                url: !lambda |-
                        return "https://log.brewfather.net/stream?id=${options.brewfather.apiKey}";
                request_headers: 
                  Content-Type: application/json
                body: !lambda |-
                          char buffer[256];
                          float gravity = id(tilt_gravity_${tilt.color.colorKey}).state / 1000.0;
                          float temp = id(tilt_temperature_${tilt.color.colorKey}).state;

                          snprintf(buffer, sizeof(buffer),
                            "{"
                              "\\"device_source\\": \\"%s\\","
                              "\\"name\\": \\"%s\\","
                              "\\"report_source\\": \\"%s\\","
                              "\\"gravity\\": %.3f,"
                              "\\"gravity_unit\\": \\"%s\\","
                              "\\"temp\\": %.1f,"
                              "\\"temp_unit\\": \\"%s\\""
                            "}",
                            "Tilt", 
                            "Tilt ${tilt.color.name}", 
                            "${friendlyName}",
                            gravity,
                            "G",
                            temp, 
                            "C"
                          );
                          return std::string(buffer);`
        });
    }

    tiltSenseGeneratedFirmware += `

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
          id(handle_touch).execute();`;

    tiltSenseGeneratedFirmware += `

script:
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
            tiltSenseGeneratedFirmware += `
                            if (id(current_page) == ${index}) {
                              if (id(enable_tilt_${tilt.color.colorKey})) {
                                id(switch_enable_tilt_${tilt.color.colorKey}).turn_off();
                              } else {
                                id(switch_enable_tilt_${tilt.color.colorKey}).turn_on();
                              }
                            }`;
        } else {
            tiltSenseGeneratedFirmware += ` else if (id(current_page) == ${index}) {
                              if (id(enable_tilt_${tilt.color.colorKey})) {
                                id(switch_enable_tilt_${tilt.color.colorKey}).turn_off();
                              } else {
                                id(switch_enable_tilt_${tilt.color.colorKey}).turn_on();
                              }
                            }`;
        }
    });

    tiltSenseGeneratedFirmware += `
            - if:
                condition:
                  lambda: 'return id(last_touch_x) < 60 && id(current_page) > 0;'
                then:
                  - lambda: |-
                      id(current_page) -= 1;`

    for (let i = 0; i < tilts.length; i++) {
        tiltSenseGeneratedFirmware += `
                  - if:
                      condition:
                        lambda: 'return id(current_page) == ${i};'
                      then:
                        - lvgl.page.show: 
                            id: display_${tilts[i].color.colorKey}
                            animation: MOVE_RIGHT
                            time: 200ms`;
    }

    tiltSenseGeneratedFirmware += `
            - if:
                condition:
                  lambda: 'return id(last_touch_x) > 180 && id(current_page) < ${tilts.length - 1};'
                then:
                  - lambda: |-
                      id(current_page) += 1;`

    for (let i = 0; i < tilts.length; i++) {
        tiltSenseGeneratedFirmware += ` 
                  - if:
                      condition:
                        lambda: 'return id(current_page) == ${i};'
                      then:
                        - lvgl.page.show:
                            id: display_${tilts[i].color.colorKey}
                            animation: MOVE_LEFT
                            time: 200ms`;
    }

    tiltSenseGeneratedFirmware += `

lvgl:
  id: lvgl_id
  displays:
    - lcd_display
  touchscreens:
    - tiltsense_touchscreen
  pages:`;

    tilts.forEach((tilt: Tilt) => {
        tiltSenseGeneratedFirmware += `
        - id: display_${tilt.color.colorKey}
          widgets:
            - arc:
                id: border_circle_${tilt.color.colorKey}
                align: CENTER
                arc_color: !lambda |-
                              if (id(enable_tilt_${tilt.color.colorKey})) {
                                return lv_color_hex(${tilt.color.displayColor.replace("#", "0x")});
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
                y: 90`;
    });

    return tiltSenseGeneratedFirmware;
}