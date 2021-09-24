import { useCallback } from 'react';

let timer;
const useDebounce = (callback, delay) =>
  useCallback(
    (...args) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

export default useDebounce;
