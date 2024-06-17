import React from 'react'

export const setStorage = (key, value) => {
  return (
    sessionStorage.setItem(key, value)
  );
}
export const getStorage = (key) => {
  return (
    sessionStorage.getItem(key)
  );
}
export const removeStorage = (key) => {
  return (
    sessionStorage.removeItem(key)
  );
}

export default getStorage;