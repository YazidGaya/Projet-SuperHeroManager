export const logInfo = (message: string) => {
  console.log(`[INFO] ${message}`);
};

export const logError = (message: string, error?: unknown) => {
  console.error(`[ERROR] ${message}`, error);
};
