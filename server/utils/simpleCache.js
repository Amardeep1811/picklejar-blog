const cache = new Map();

export const getCached = (key) => {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }
  return item.value;
};

export const setCached = (key, value, ttlSeconds = 60) => {
  const expiry = Date.now() + ttlSeconds * 1000;
  cache.set(key, { value, expiry });
};

export const clearCache = (prefix) => {
  if (!prefix) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
};
