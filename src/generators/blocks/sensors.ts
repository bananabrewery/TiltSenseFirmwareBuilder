import type { Tilt } from '@/models/tilt.ts';
import type { FirmwareConfig } from '@/types/firmware.ts';

export function generateSensorsBlock(config: FirmwareConfig, tilts: Tilt[]): string {
  let sensorsBlock = `sensor:
`;
  sensorsBlock += `  - platform: internal_temperature
    name: "${config.friendlyName} Internal Temperature"
  - platform: adc
    pin: GPIO01
    name: "${config.friendlyName} Battery Voltage"
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
    name: "${config.friendlyName} Battery Level"
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
    sensorsBlock += `
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

  sensorsBlock += `

`;

  return sensorsBlock;
}
