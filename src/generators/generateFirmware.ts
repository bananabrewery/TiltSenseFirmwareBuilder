import {type Tilt} from '../models/Tilt';

export function generateFirmwareConfig(tilts: Tilt[], options: { brewfather: any; ha: boolean; }): any {
    console.log(options);
    const name = "tiltsensebeta";
    const friendlyName = "TiltSenseBeta"
    const pressureUnitOfMeasure = "PSI";

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
  port: 80;
  
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
              int8_t tx_power = ibeacon.get_tx_power();
              int rssi = x.get_rssi();
              ESP_LOGD("tilt", "[${tilt.color.name}] Temperature = %.2f °C, Gravity = %.1f, TxPower = %d, RSSI = %d", temp_c, gravity, tx_power, rssi);
              id(tilt_temperature_${tilt.color.colorKey}).publish_state(temp_c);
              id(tilt_gravity_${tilt.color.colorKey}).publish_state(gravity);
            }`;
        } else {
            tiltSenseGeneratedFirmware += `
            if (uuid == "${tilt.color.id}" && id(enable_tilt_${tilt.color.colorKey})) {
              float temp_c = (ibeacon.get_major() - 32) * 5.0f / 9.0f;
              float gravity = ibeacon.get_minor();
              int8_t tx_power = ibeacon.get_tx_power();
              int rssi = x.get_rssi();
              ESP_LOGD("tilt", "[${tilt.color.name}] Temperature = %.2f °C, Gravity = %.0f, TxPower = %d, RSSI = %d", temp_c, gravity, tx_power, rssi);
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
          arc_color: 0x${tilt.color.hexColor.slice(1)}
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

                          float gravity = id(tilt_gravity_${tilt.color.colorKey}).state;
                          if (std::isnan(gravity)) gravity = 0.0;
                          gravity /= 1000.0;

                          float temp = id(tilt_temperature_${tilt.color.colorKey}).state;
                          if (std::isnan(temp)) temp = 0.0;

                          float pressure = id(pressure_sensor_${tilt.color.colorKey}).state;
                          if (std::isnan(pressure)) pressure = 0.0;

                          snprintf(buffer, sizeof(buffer),
                            "{"
                              "\\"device_source\\": \\"%s\\","
                              "\\"name\\": \\"%s\\","
                              "\\"gravity\\": %.3f,"
                              "\\"gravity_unit\\": \\"%s\\","
                              "\\"temp\\": %.1f,"
                              "\\"temp_unit\\": \\"%s\\","
                              "\\"pressure\\": %.2f,"
                              "\\"pressure_unit\\": \\"%s\\""
                            "}",
                            "${friendlyName}", 
                            "Tilt ${tilt.color.name}", 
                            gravity,
                            "G",
                            temp, 
                            "C",
                            pressure,
                            "${pressureUnitOfMeasure}"
                          );
                          return std::string(buffer);`
        });
    }


    return tiltSenseGeneratedFirmware;
}