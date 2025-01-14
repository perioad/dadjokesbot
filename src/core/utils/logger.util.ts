export const log = (text: string, ...args: any[]) => {
  console.info(text.toUpperCase(), ...args);
};
