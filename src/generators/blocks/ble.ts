import type {Tilt} from "../../models/tilt.ts";

export function generateBLEBlock(tilts: Tilt[]): string {
    let BLEBlock = `esp32_ble_tracker:
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
        const divisor = tilt.isPro ? 10.0 : 1.0;
        BLEBlock += `
            if (uuid == "${tilt.color.id}" && id(enable_tilt_${tilt.color.colorKey})) {
              float temp_c = ((ibeacon.get_major() / ${divisor}f) - 32.0f) * 5.0f / 9.0f;
              float gravity = ibeacon.get_minor() / ${divisor}f;
              int rssi = x.get_rssi();
              ESP_LOGD("tilt", "[${tilt.color.name}] Temperature = %.2f °C, Gravity = %.0f, RSSI = %d", temp_c, gravity, rssi);
              id(tilt_temperature_${tilt.color.colorKey}).publish_state(temp_c);
              id(tilt_gravity_${tilt.color.colorKey}).publish_state(gravity);
            }`;
    });

    BLEBlock += `
          }

`;

    return BLEBlock;
}