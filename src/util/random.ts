export const getRandomInt = (max: number) => getRandomIntRange(0, max);
export const getRandomIntRange = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};
