/* eslint-disable consistent-return */
import { useEffect } from 'react';

const useLocalStorage = (key, isListen) => {
  const setlocalStorageData = (value) => {
    const event = new Event('changeLocalStorage');
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(event);
  };

  const getlocalStorageData = () => JSON.parse(localStorage.getItem(key));

  useEffect(() => {
    if (isListen) {
      window.addEventListener('changeLocalStorage', getlocalStorageData);
      return () =>
        window.removeEventListener('changeLocalStorage', getlocalStorageData);
    }
  }, []);

  return {
    setlocalStorageData,
    getlocalStorageData,
  };
};

export default useLocalStorage;
