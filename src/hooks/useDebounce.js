import { useCallback } from 'react';

let timer;
const useDebounce = (callback, delay) => {
  const debouncedCallback = useCallback(
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

  return debouncedCallback;
};

export default useDebounce;
