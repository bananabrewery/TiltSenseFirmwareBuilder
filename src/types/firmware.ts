export interface BrewfatherOptions {
    enabled: boolean;
    apiKey: string;
}

export interface FirmwareOptions {
    brewfather: BrewfatherOptions;
    ha: boolean;
}
