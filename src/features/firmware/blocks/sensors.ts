import type { Tilt } from '@/features/configuration/types/tilt.ts';
import type { FirmwareContext } from '@/features/firmware/types/firmware.ts';
import { getInternalBattery } from '@/features/firmware/blocks/devices/common.ts';

export function generateSensorsBlock(context: FirmwareContext): string {
  const lines: string[] = [`sensor:`];

  lines.push(
    `  - platform: internal_temperature`,
    `    name: "${context.firmwareOptions.friendlyName} Internal Temperature"`,
    `    icon: "mdi:thermometer"`,
    `    entity_category: diagnostic`
  );

  lines.push(...getInternalBattery(context));

  lines.push(
    `  - platform: template`,
    `    name: "${context.firmwareOptions.friendlyName} Battery Level"`,
    `    icon: "mdi:battery-medium"`,
    `    unit_of_measurement: "%"`,
    `    device_class: battery`,
    `    entity_category: diagnostic`,
    `    accuracy_decimals: 0`,
    `    lambda: |-`,
    `              float v = id(battery_voltage).state;`,
    `              float percent = 100.0 / (1.0 + exp(-10.0 * (v - 3.85)));`,
    `              if (percent > 100.0) return 100.0;`,
    `              else if (percent < 0.0) return 0.0;`,
    `              else return percent;`
  );

  context.tilts.forEach((tilt: Tilt) => {
    const key = tilt.color.colorKey;
    const name = tilt.color.name;
    const units = context.configConstants.pressureUnits;

    lines.push(
      `  - platform: template`,
      `    id: tilt_gravity_${key}`,
      `    name: "Tilt ${name} Gravity"`,
      `    icon: "mdi:trending-down"`,
      `    accuracy_decimals: 0`,
      `    unit_of_measurement: "SG"`,
      `    update_interval: never`,
      `    on_value:`,
      `      then:`,
      `        - lvgl.label.update:`,
      `            id: ble_gravity_label_${key}`,
      `            text: !lambda |-`,
      `                    char buffer[8];`,
      `                    snprintf(buffer, sizeof(buffer), "%.3f", id(tilt_gravity_${key}).state / 1000.0);`,
      `                    return std::string(buffer);`
    );

    lines.push(
      `  - platform: template`,
      `    name: "Tilt ${name} Temperature"`,
      `    icon: "mdi:thermometer"`,
      `    id: tilt_temperature_${key}`,
      `    device_class: "temperature"`,
      `    accuracy_decimals: 1`,
      `    unit_of_measurement: "°C"`,
      `    update_interval: never`,
      `    on_value:`,
      `      then:`,
      `        - lvgl.label.update:`,
      `            id: ble_temp_label_${key}`,
      `            text: !lambda |-`,
      `                    char buffer[10];`,
      `                    snprintf(buffer, sizeof(buffer), "%.1f °C", id(tilt_temperature_${key}).state);`,
      `                    return std::string(buffer);`
    );

    if (
      context.firmwareOptions.enablePressureSensors &&
      tilt.haPressureSensor &&
      tilt.haPressureSensor.length > 0
    ) {
      lines.push(
        `  - platform: homeassistant`,
        `    id: pressure_sensor_${key}`,
        `    entity_id: ${tilt.haPressureSensor}`,
        `    internal: True`,
        `    on_value:`,
        `      then:`,
        `        - lvgl.label.update:`,
        `            id: pressure_label_${key}`,
        `            text: !lambda |-`,
        `              char buffer[10];`,
        `              if (std::isnan(id(pressure_sensor_${key}).state)) {`,
        `                return std::string("");`,
        `              } else {`,
        `                snprintf(buffer, sizeof(buffer), "%.1f ${units}", id(pressure_sensor_${key}).state);`,
        `                return std::string(buffer);`,
        `              }`
      );
    }
  });

  lines.push('');

  return lines.join('\n');
}
