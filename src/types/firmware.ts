export interface BrewfatherOptions {
  enabled: boolean
  apiKey: string
}

export interface WifiConfig {
  SSID: string
  password: string
}

export interface FirmwareOptions {
  brewfather: BrewfatherOptions
  ha: boolean
  wifiConfig: WifiConfig
}
