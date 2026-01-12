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
    lines.push(`          static uint32_t last_seen_${tilt.color.colorKey} = 0;`);
  });

  lines.push(
    `          struct TiltConfig {`,
    `            const char* uuid;`,
    `            bool* enabled;`,
    `            int* gravity_offset;`,
    `            uint32_t* last_seen;`,
    `            bool is_pro;`,
    `            const char* name;`,
    `            esphome::sensor::Sensor* temp_sensor;`,
    `            esphome::sensor::Sensor* gravity_sensor;`,
    `          };`
  );

  lines.push(`          TiltConfig tilts[] = {`);

  context.tilts.forEach((tilt: Tilt) => {
    lines.push(
      `            {`,
      `              "${tilt.color.id}",`,
      `              &id(enable_tilt_${tilt.color.colorKey}),`,
      `              &id(gravity_offset_${tilt.color.colorKey}),`,
      `              &last_seen_${tilt.color.colorKey},`,
      `              ${tilt.isPro ? 'true' : 'false'},`,
      `              "${tilt.color.name}",`,
      `              id(tilt_temperature_${tilt.color.colorKey}),`,
      `              id(tilt_gravity_${tilt.color.colorKey}),`,
      `            },`
    );
  });

  lines.push(`          };`, ``);

  lines.push(
    `          for (auto &t : tilts) {`,
    `            if (uuid != t.uuid || !*t.enabled) continue;`,
    `            if (now - *t.last_seen < 5000) return;`,
    `            *t.last_seen = now;`,
    `            float major = ibeacon.get_major();`,
    `            float minor = ibeacon.get_minor();`,
    `            if (t.is_pro) {`,
    `              major /= 10.0f;`,
    `              minor /= 10.0f;`,
    `            }`,
    `            float temp_c = (major - 32.0f) * 5.0f / 9.0f;`,
    `            float gravity = minor + static_cast<float>(*t.gravity_offset);`,
    `            ESP_LOGD("tilt", "[%s] Temperature = %.2f °C, Gravity = %.0f", t.name, temp_c, gravity);`,
    `            t.temp_sensor->publish_state(temp_c);`,
    `            t.gravity_sensor->publish_state(gravity);`,
    `          }`,
    ``
  );

  return lines.join('\n');
}
