import { useCallback } from 'react';

let timer;
function useDebounce(callback, delay) {
  const debouncedCallback = useCallback(() => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      callback();
    }, delay);
  }, [callback, delay]);

  return debouncedCallback;
}

export default useDebounce;
