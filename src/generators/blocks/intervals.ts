import type { Tilt } from '@/models/tilt.ts';
import type { FirmwareConfig, FirmwareOptions } from '@/types/firmware.ts';

function createBrewfatherRequest(
  firmwareOptions: FirmwareOptions,
  tilt: Tilt,
  config: FirmwareConfig
): string {
  return `  - http_request.post:
                url: https://log.brewfather.net/stream?id=${firmwareOptions.brewfather.apiKey}
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
                            "Tilt ${tilt.isPro ? 'Pro ' : ''}${tilt.color.name}",
                            "${config.friendlyName}",
                            gravity,
                            "G",
                            temp,
                            "C"
                          );
                          return std::string(buffer);`;
}

export function generateIntervalsBlock(
  tilts: Tilt[],
  firmwareOptions: FirmwareOptions,
  config: FirmwareConfig
): string {
  let intervalsBlock = `interval:
  - interval: 5s
    then:
      - lambda: |-
          unsigned long now = millis();
          if (!id(screen_dimmed) && now - id(last_touch_time) > ${config.screenTimeout}) {
            id(screen_dimmed) = true;
          }
      - if:
          condition:
            lambda: 'return id(screen_dimmed);'
          then:
            - light.turn_off:
                id: led`;

  if (firmwareOptions.brewfather.enabled) {
    tilts.forEach((tilt: Tilt) => {
      intervalsBlock += `
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
          `;
      intervalsBlock += createBrewfatherRequest(firmwareOptions, tilt, config);
    });
  }

  intervalsBlock += `

`;

  return intervalsBlock;
}
