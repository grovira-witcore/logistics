// Witcore Suite - Version 1.0.0
// Copyright(c) 2024 Witcore LLC. All rights reserved.

export function isValid(target) {
  const isValidRecursive = function (current) {
    if (current.dataset.invalid) {
      return false;
    }
    for (const child of current.children) {
      if (!isValidRecursive(child)) {
        return false;
      }
    }
    return true;
  }
  return isValidRecursive(target);
}
