/* eslint-disable no-bitwise */

const hash = (str) => {
  let baseHash = 0;

  if (!str.length) {
    return baseHash;
  }

  for (let i = 0; i < str.length; i += 1) {
    baseHash = (baseHash << 5) - baseHash + str.charCodeAt(i);
    baseHash |= 0;
  }

  return baseHash;
};
