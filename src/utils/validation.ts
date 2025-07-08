export const isValidPressureSensorEntity = (value: string | undefined): boolean => {
  if (!value) return true;
  return /^sensor\.[\w.]+$/.test(value.trim());
};

export const isValidEmail = (email: string): boolean => {
  return /^\S+@\S+\.\S+$/.test(email);
};
