import NodeCache from 'node-cache';

const DEFAULT_CACHE_TIME = 3600;
const cache = new NodeCache({ stdTTL: DEFAULT_CACHE_TIME, checkperiod: 600 });

export const setCache = <T>(key: string, value: T): void => {
  cache.set(key, value);
};

export const getCache = <T>(key: string): T | undefined => {
  return cache.get<T>(key);
};

export const delCache = (key: string): void => {
  cache.del(key);
};
