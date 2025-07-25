export const generateTempId = (): string => {
  return "temp-" + Math.random().toString(36).substr(2, 9);
};