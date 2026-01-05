export type UnknownObject = Record<string, any>;
export const serialize = (object: UnknownObject): string => {
  const str = [];
  for (const p in object) {
    if (Object.prototype.hasOwnProperty.call(object, p)) {
      if (object[p] || typeof object[p] === 'boolean') {
        if (Array.isArray(object[p]) && !object[p].length) continue;
        str.push(`${encodeURIComponent(p)}=${encodeURIComponent(object[p])}`);
      }
    }
  }
  return str.join('&');
};