const serialize = (obj: any) => JSON.stringify(obj);

export const isSame = (obj1: any, obj2: any) =>
  obj1 === obj2 || serialize(obj1) === serialize(obj2);

export function removeProps(obj: Record<string, any>, propsToRemove: string[]) {
  let newObj: Record<string, any> = {};
  Object.keys(obj).forEach((key) => {
    if (propsToRemove.indexOf(key) === -1) newObj[key] = obj[key];
  });
  return newObj;
}
