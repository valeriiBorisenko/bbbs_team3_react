import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef
} from 'react';

// отслеживает, что клик произошёл вне контейнера-рефа и запускает колбэк
export const useClickOutside = (callback) => {
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
export const useSmoothScrollOnWindow = (coordinate) => {
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        coordinate,
        behavior: 'smooth'
      });
    }, 500);
  }, []);
};

// горизонтальная плавная прокрутка
// step: number
export const useSmoothHorizontalScroll = ({ step }) => {
  const ref = useRef();

  const scrollByWheel = useCallback((evt) => {
    if (ref && ref.current) {
      evt.preventDefault();
      ref.current.scrollTo({
        left: ref.current.scrollLeft + evt.deltaY * step,
        behavior: 'smooth'
      });
    }
  }, [ref.current]);

  // eslint-disable-next-line consistent-return
  useLayoutEffect(() => {
    if (ref && ref.current) {
      ref.current.addEventListener('wheel', scrollByWheel);
      return () => ref.current.removeEventListener('wheel', scrollByWheel);
    }
  }, []);

  return ref;
};
