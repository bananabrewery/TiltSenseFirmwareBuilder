export type TiltColorKey =
    | 'black'
    | 'blue'
    | 'green'
    | 'orange'
    | 'red'
    | 'yellow'
    | 'pink'
    | 'purple';

export type TiltColor = {
    name: Capitalize<TiltColorKey>;
    colorKey: TiltColorKey;
    hexColor: string;
};

export const TiltColorsHex: Record<TiltColorKey, string> = {
    black: '#666666',
    blue: '#3498db',
    green: '#2ecc71',
    orange: '#e67e22',
    red: '#e74c3c',
    yellow: '#f1c40f',
    pink: '#e91e63',
    purple: '#9b59b6',
};

export const TiltColors: TiltColor['name'][] = [
    'Black', 'Blue', 'Green', 'Orange', 'Red', 'Yellow', 'Pink', 'Purple'
];

export type Tilt = {
    enabled: boolean;
    color: TiltColor;
    isPro: boolean;
};

export type Tilts = {
    [key: string]: Tilt;
};