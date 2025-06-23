export type TiltColorKey =
  | 'black'
  | 'blue'
  | 'green'
  | 'orange'
  | 'red'
  | 'yellow'
  | 'pink'
  | 'purple'

export type TiltColor = {
  name: Capitalize<TiltColorKey>
  colorKey: TiltColorKey
  hexColor: string
  displayColor: string
  id: string
}

export const TiltColorsHex: Record<TiltColorKey, string> = {
  black: '#666666',
  blue: '#3498db',
  green: '#2ecc71',
  orange: '#e67e22',
  red: '#e74c3c',
  yellow: '#f1c40f',
  pink: '#e91e63',
  purple: '#9b59b6'
}

export const TiltColorsDisplay: Record<TiltColorKey, string> = {
  black: '#000000',
  blue: '#0000FF',
  green: '#00FF00',
  orange: '#FFA500',
  red: '#FF0000',
  yellow: '#FFFF00',
  pink: '#FF00FF',
  purple: '#800080'
}

export const TiltColorId: Record<TiltColorKey, string> = {
  black: 'A495BB30-C5B1-4B44-B512-1370F02D74DE',
  blue: 'A495BB60-C5B1-4B44-B512-1370F02D74DE',
  green: 'A495BB20-C5B1-4B44-B512-1370F02D74DE',
  orange: 'A495BB50-C5B1-4B44-B512-1370F02D74DE',
  red: 'A495BB10-C5B1-4B44-B512-1370F02D74DE',
  yellow: 'A495BB70-C5B1-4B44-B512-1370F02D74DE',
  pink: 'A495BB80-C5B1-4B44-B512-1370F02D74DE',
  purple: 'A495BB40-C5B1-4B44-B512-1370F02D74DE'
}

export const TiltColors: TiltColor['name'][] = [
  'Black',
  'Blue',
  'Green',
  'Orange',
  'Red',
  'Yellow',
  'Pink',
  'Purple'
]

export type Tilt = {
  enabled: boolean
  color: TiltColor
  isPro: boolean
}

export type Tilts = {
  [key: string]: Tilt
}
