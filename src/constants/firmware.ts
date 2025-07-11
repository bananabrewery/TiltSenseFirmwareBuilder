export const configConstants = {
  isBeta: false,
  name: 'tiltsense',
  friendlyName: 'TiltSense',
  screenTimeout: 120000,
  bottomScreenThreshold: 220,
  swipeLeftThreshold: 60,
  swipeRightThreshold: 180,
  animationTime: '200ms',
  pressureUnits: 'PSI',
  batteryCalibration: [
    [1.49, 4.16],
    [1.26, 4.01],
    [1.2, 3.95],
    [1.07, 3.9],
    [1.04, 3.83],
    [1.02, 3.78],
    [1.0, 3.71],
    [0.96, 3.61],
  ],
};

export const appConstants = {
  timeBetweenCompilations: 3600000,
};
