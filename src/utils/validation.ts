export const isValidPressureSensorEntity = (value: string | undefined): boolean => {
  if (!value) return true;
  return /^sensor\.[\w.]+$/.test(value.trim());
};
