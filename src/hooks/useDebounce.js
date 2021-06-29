import { useCallback } from 'react';

let timer;
const useDebounce = (callback, delay) => {
  const debouncedCallback = useCallback(() => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      callback();
    }, delay);
  }, [callback, delay]);

  return debouncedCallback;
};

export default useDebounce;
