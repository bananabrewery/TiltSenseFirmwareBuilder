import type { Tilt } from '@/features/configuration/types/tilt.ts';
import type { FirmwareContext } from '@/features/firmware/types/firmware.ts';

function createBrewfatherRequest(context: FirmwareContext, tilt: Tilt): string[] {
  const lines: string[] = [
    `            - http_request.post:`,
    `                url: https://log.brewfather.net/stream?id=${context.firmwareOptions.brewfather.apiKey}`,
    `                request_headers:`,
    `                  Content-Type: application/json`,
    `                body: !lambda |-`,
    `                          char buffer[256];`,
    `                          float gravity = id(tilt_gravity_${tilt.color.colorKey}).state / 1000.0;`,
    `                          float temp = id(tilt_temperature_${tilt.color.colorKey}).state;`,
  ];

  if (tilt.haPressureSensor !== undefined && tilt.haPressureSensor.length > 0) {
    lines.push(
      `                          float pressure = id(pressure_sensor_black).state;`,
      `                          if (std::isnan(pressure)) pressure = 0.0;`
    );
  }

  lines.push(
    ``,
    `                          snprintf(buffer, sizeof(buffer),`,
    `                            "{"`,
    `                              "\\"device_source\\": \\"%s\\","`,
    `                              "\\"name\\": \\"%s\\","`,
    `                              "\\"report_source\\": \\"%s\\","`,
    `                              "\\"gravity\\": %.3f,"`,
    `                              "\\"gravity_unit\\": \\"%s\\","`,
    `                              "\\"temp\\": %.1f,"`
  );

  if (tilt.haPressureSensor !== undefined && tilt.haPressureSensor.length > 0) {
    lines.push(
      `                              "\\"temp_unit\\": \\"%s\\","`,
      `                              "\\"pressure\\": %.1f,"`,
      `                              "\\"pressure_unit\\": \\"%s\\""`
    );
  } else {
    lines.push(`                              "\\"temp_unit\\": \\"%s\\""`);
  }

  lines.push(
    `                            "}",`,
    `                            "Tilt",`,
    `                            "Tilt ${tilt.isPro ? 'Pro ' : ''}${tilt.color.name}",`,
    `                            "${context.configConstants.friendlyName}",`,
    `                            gravity,`,
    `                            "G",`,
    `                            temp,`,
    `                            "C"`
  );

  if (tilt.haPressureSensor !== undefined && tilt.haPressureSensor.length > 0) {
    lines[lines.length - 1] += ',';
    lines.push(
      `                            pressure,`,
      `                            "${context.configConstants.pressureUnits}"`
    );
  }

  lines.push(
    `                          );`,
    `                          return std::string(buffer);`
  );

  return lines;
}

export function generateIntervalsBlock(context: FirmwareContext): string {
  const { screenTimeout } = context.configConstants;
  const lines: string[] = [
    `interval:`,
    `  - interval: 5s`,
    `    then:`,
    `      - lambda: |-`,
    `          unsigned long now = millis();`,
    `          if (!id(screen_dimmed) && now - id(last_touch_time) > ${screenTimeout}) {`,
    `            id(screen_dimmed) = true;`,
    `          }`,
    `      - if:`,
    `          condition:`,
    `            lambda: 'return id(screen_dimmed);'`,
    `          then:`,
    `            - light.turn_off:`,
    `                id: led`,
  ];

  if (context.firmwareOptions.brewfather.enabled) {
    context.tilts.forEach((tilt: Tilt) => {
      lines.push(
        `  - interval: 15min`,
        `    then:`,
        `      - if:`,
        `          condition:`,
        `            lambda: |-`,
        `                return (`,
        `                    id(enable_tilt_${tilt.color.colorKey}) &&`,
        `                    !isnan(id(tilt_temperature_${tilt.color.colorKey}).state) &&`,
        `                    !isnan(id(tilt_gravity_${tilt.color.colorKey}).state)`,
        `                );`,
        `          then:`
      );

      lines.push(...createBrewfatherRequest(context, tilt));
    });
  }

  lines.push('');

  return lines.join('\n');
}
