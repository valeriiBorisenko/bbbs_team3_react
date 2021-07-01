import { useEffect, useState } from 'react';

export const setlocalStorageData = (key, value) => {
  const event = new Event('changeLocalStorage');
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(event);
};

export const getlocalStorageData = (key) =>
  JSON.parse(localStorage.getItem(key));

export const useLocalStorage = (key) => {
  const [localStorageItem, setLocalStorageItem] = useState(null);

  const setItem = () => {
    setLocalStorageItem(getlocalStorageData(key));
  };

  useEffect(() => {
    window.addEventListener('changeLocalStorage', setItem, false);
    return () =>
      window.removeEventListener('changeLocalStorage', setItem, false);
  }, []);

  return localStorageItem;
};
