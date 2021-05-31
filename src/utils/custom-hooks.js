import { useCallback, useEffect, useRef } from 'react';

// отслеживает, что клик произошёл вне контейнера-рефа и запускает колбэк
const useClickOutside = (callback) => {
  const ref = useRef(null);

  const clickListener = useCallback((evt) => {
    if (ref && ref.current) {
      if (!ref.current.contains(evt.target)) {
        callback();
      }
    }
  }, [ref.current]);

  useEffect(() => {
    document.addEventListener('mousedown', clickListener);
    return () => document.removeEventListener('mousedown', clickListener);
  }, []);

  return ref;
};

// плавный скролл при монтировании компонента
const useSmoothScroll = (coordinate) => {
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        ...coordinate,
        behavior: 'smooth'
      });
    }, 500);
  }, []);
};

// горизонтальная плавная прокрутка
// step: number
const useSmoothHorizontalScroll = ({ step }) => {
  const ref = useRef(null);

  const scrollByWheel = useCallback((evt) => {
    if (ref.current) {
      evt.preventDefault();
      ref.current.scrollTo({
        left: ref.current.scrollLeft + evt.deltaY * step,
        behavior: 'smooth'
      });
    }
  }, [ref.current]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('wheel', scrollByWheel);
      return () => ref.current.removeEventListener('wheel', scrollByWheel);
    }
  }, []);

  return ref;
};

export { useClickOutside, useSmoothScroll, useSmoothHorizontalScroll };
