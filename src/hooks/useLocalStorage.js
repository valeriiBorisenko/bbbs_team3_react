import { useEffect } from 'react';

// вспомогательные функции
export const setLocalStorageData = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

export const getLocalStorageData = (key) =>
  JSON.parse(localStorage.getItem(key));

export const dispatchLocalStorageEvent = (key, value) => {
  const event = new Event('changeLocalStorage');
  setLocalStorageData(key, value);
  window.dispatchEvent(event);
};

// хук слушает изменение определённого ключа в localStorage и возвращает его значение при любом изменении
// работает в связке с dispatchLocalStorageEvent
export const useLocalStorage = (key) => {
  const getLocalStorageItem = () => getLocalStorageData(key);
  useEffect(() => {
    window.addEventListener('changeLocalStorage', getLocalStorageItem);
    return () =>
      window.removeEventListener('changeLocalStorage', getLocalStorageItem);
  }, []);

  return getLocalStorageItem;
};
