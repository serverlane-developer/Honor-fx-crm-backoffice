/* eslint-disable import/prefer-default-export */
export function objectToQueryString(obj = {}) {
  const queryParams = [];

  const keys = Object.keys(obj);
  let i;
  let value;
  let key;
  for (i = 0; i < keys.length; i += 1) {
    key = keys[i];
    value = obj[key];
    if (value) {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(value);
      queryParams.push(`${encodedKey}=${encodedValue}`);
    }
  }

  return queryParams.join("&");
}
