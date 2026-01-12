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
    `          auto opt = x.get_ibeacon();`,
    `          if (!opt.has_value()) return;`,
    `          auto ibeacon = opt.value();`,
    `          std::string uuid = ibeacon.get_uuid().to_string();`,
    `          uint32_t now = millis();`,
  ];

  context.tilts.forEach((tilt: Tilt) => {
    const { color, isPro } = tilt;
    const divisor = isPro ? ' / 10.0f' : '';
    lines.push(
      `          static uint32_t last_seen_${color.colorKey} = 0;`,
      `          if (uuid == "${color.id}" && id(enable_tilt_${color.colorKey})) {`,
      `            if (now - last_seen_${color.colorKey} < 5000) return;`,
      `            last_seen_${color.colorKey} = now;`,
      `            float temp_c = ((ibeacon.get_major()${divisor}) - 32.0f) * 5.0f / 9.0f;`,
      `            float gravity_raw = ibeacon.get_minor()${divisor};`,
      `            float gravity = gravity_raw + id(gravity_offset_${color.colorKey});`,
      `            ESP_LOGD("tilt", "[${color.name}] Temperature = %.2f °C, Gravity = %.0f", temp_c, gravity);`,
      `            id(tilt_temperature_${color.colorKey}).publish_state(temp_c);`,
      `            id(tilt_gravity_${color.colorKey}).publish_state(gravity);`,
      `          }`
    );
  });

  return lines.join('\n');
}
