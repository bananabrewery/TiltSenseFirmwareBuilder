import type {FirmwareOptions} from "@/types/firmware.ts";

export function generateBaseConfigBlock(config: any, firmwareOptions: FirmwareOptions): string {
    let baseConfigBlock = `esphome:
  name: "${config.name}"
  friendly_name: "${config.friendlyName}"

esp32:
  board: esp32-s3-devkitc-1
  variant: esp32s3
  framework:
    type: arduino
    version: latest
  flash_size: 16MB

logger:`;

    baseConfigBlock += config.isBeta ? `
  level: DEBUG` : `
  level: INFO`;

    baseConfigBlock += firmwareOptions.ha ? `

api: 
` : `
`;
    baseConfigBlock += firmwareOptions.brewfather.enabled ? `
http_request:
  verify_ssl: False 
` : ``;

    baseConfigBlock += `
ota:
  - platform: esphome

wifi:`;
    if (firmwareOptions.wifiConfig.SSID.trim() && firmwareOptions.wifiConfig.password.trim()) {
        baseConfigBlock += `
  ssid: ${firmwareOptions.wifiConfig.SSID}
  password: ${firmwareOptions.wifiConfig.password}`
    }
    baseConfigBlock += `
  ap:

captive_portal:

web_server:
  port: 80
  
`;

    return baseConfigBlock;
}