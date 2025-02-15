export const generateSKU = (): string => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 5);
    return `${timestamp}${randomStr}`.toUpperCase();
  };