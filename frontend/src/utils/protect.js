// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

export function protect(fn, arg) {
  if (fn) {
    try {
      const value = fn(arg);
      if (typeof value === 'object') {
        return null;
      }
      return fn(arg);
    }
    catch (err) {
      console.error(err);
      return null;
    }
  }
  else {
    return null;
  }
}
