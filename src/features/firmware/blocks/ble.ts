import type { Tilt } from '@/features/configuration/types/tilt.ts';
import type { FirmwareContext } from '@/features/firmware/types/firmware.ts';

export function generateBLEBlock(context: FirmwareContext): string {
  const lines: string[] = [
    `esp32_ble_tracker:`,
    `  scan_parameters:`,
    `    interval: 5000ms`,
    `    window: 1000ms`,
    `  on_ble_advertise:`,
    `    then:`,
    `      - lambda: |-`,
    `          if (x.get_ibeacon().has_value()) {`,
    `            auto ibeacon = x.get_ibeacon().value();`,
    `            std::string uuid = ibeacon.get_uuid().to_string();`,
  ];

  context.tilts.forEach((tilt: Tilt) => {
    const { color, isPro } = tilt;
    const divisor = isPro ? ' / 10.0f' : '';
    lines.push(
      `            if (uuid == "${color.id}" && id(enable_tilt_${color.colorKey})) {`,
      `              float temp_c = ((ibeacon.get_major()${divisor}) - 32.0f) * 5.0f / 9.0f;`,
      `              float gravity = ibeacon.get_minor()${divisor};`,
      `              int rssi = x.get_rssi();`,
      `              ESP_LOGD("tilt", "[${color.name}] Temperature = %.2f °C, Gravity = %.0f, RSSI = %d", temp_c, gravity, rssi);`,
      `              id(tilt_temperature_${color.colorKey}).publish_state(temp_c);`,
      `              id(tilt_gravity_${color.colorKey}).publish_state(gravity);`,
      `            }`
    );
  });

  lines.push(`          }`, ``);

  return lines.join('\n');
}
