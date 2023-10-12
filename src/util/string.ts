export const toPixels = (value: number) => value.toString() + "px";

export const abbreviate = (str: string, limit: number = str.length) =>
  str.length <= limit ? str : str.slice(0, limit - 3) + "...";
