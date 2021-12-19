export const hasItems = (array: any) =>
  Array.isArray(array) && array.length > 0;

// https://stackoverflow.com/a/50029028
export const sortOn = (prop: string, list: string[]) => {
  const order: { [key: string]: number } = list.reduce(
    (obj, key, idx) => Object.assign(obj, { [key]: idx + 1 }),
    {}
  );

  const getVal = (item: { [key: string]: any }) =>
    order[item[prop]] || Infinity;

  return (a: { [key: string]: any }, b: { [key: string]: any }) =>
    getVal(a) - getVal(b);
};
