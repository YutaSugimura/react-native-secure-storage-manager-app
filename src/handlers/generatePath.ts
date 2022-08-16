export const BASE_PATH = "m/44'/60'/0'/0/${no}";

export const generatePath = (index: number = 0) => {
  return BASE_PATH.replace('${no}', index.toString());
};
