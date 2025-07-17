import type { FirmwareContext } from '@/features/firmware/types/firmware.ts';

export function generateBaseConfigBlock(context: FirmwareContext): string {
  const { configConstants, firmwareOptions } = context;
  const lines: string[] = [
    `esphome:`,
    `  name: "${configConstants.name}"`,
    `  friendly_name: "${configConstants.friendlyName}"`,
    ``,
    `esp32:`,
    `  board: esp32-s3-devkitc-1`,
    `  variant: esp32s3`,
    `  framework:`,
    `    type: esp-idf`,
    `  flash_size: 16MB`,
    ``,
    `logger:`,
    `  level: ${configConstants.isBeta ? 'DEBUG' : 'INFO'}`,
    ``,
  ];

  if (firmwareOptions.ha) {
    lines.push(`api:`, ``);
  }

  if (firmwareOptions.brewfather.enabled) {
    lines.push(`http_request:`, `  verify_ssl: False`, ``);
  }

  lines.push(`ota:`, `  - platform: web_server`, ``, `wifi:`);

  const ssid = firmwareOptions.wifiConfig.SSID.trim();
  const password = firmwareOptions.wifiConfig.password.trim();

  if (ssid && password) {
    lines.push(`  ssid: ${ssid}`, `  password: ${password}`);
  }

  lines.push(
    `  ap:`,
    ``,
    `captive_portal:`,
    ``,
    `web_server:`,
    `  port: 80`,
    ``,
    `  version: 3`,
    ``
  );

  return lines.join('\n');
}
