import { useCallback, useEffect, useRef } from 'react';

// отслеживает, что клик произошёл вне контейнера-рефа и запускает колбэк
const useClickOutside = (callback) => {
  const ref = useRef(null);

  const clickListener = useCallback(
    (evt) => {
      if (ref && ref.current) {
        if (!ref.current.contains(evt.target)) {
          callback();
        }
      }
    },
    [ref.current],
  );

  useEffect(() => {
    document.addEventListener('mousedown', clickListener);
    return () => document.removeEventListener('mousedown', clickListener);
  }, []);

  return ref;
};

export default useClickOutside;
