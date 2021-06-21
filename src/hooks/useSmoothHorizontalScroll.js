/* eslint-disable consistent-return */
import { useCallback, useLayoutEffect, useRef } from 'react';

// горизонтальная плавная прокрутка
// step: number
const useSmoothHorizontalScroll = ({ step }) => {
  const ref = useRef();

  const scrollByWheel = useCallback(
    (evt) => {
      if (ref && ref.current) {
        evt.preventDefault();
        ref.current.scrollTo({
          left: ref.current.scrollLeft + evt.deltaY * step,
          behavior: 'smooth',
        });
      }
    },
    [ref.current],
  );

  useLayoutEffect(() => {
    if (ref && ref.current) {
      ref.current.addEventListener('wheel', scrollByWheel);
      return () => ref.current.removeEventListener('wheel', scrollByWheel);
    }
  }, []);

  return ref;
};

export default useSmoothHorizontalScroll;
