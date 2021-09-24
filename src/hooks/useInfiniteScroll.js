import { useLayoutEffect, useRef } from 'react';

// хук используется для подгрузки данных и других манипуляций при появлении childRef в parentRef
const useInfiniteScroll = (
  parentRef,
  childRef,
  callbackOnIntersect,
  callbackOnHide
) => {
  const observer = useRef();

  // eslint-disable-next-line consistent-return
  useLayoutEffect(() => {
    if (parentRef && parentRef.current && childRef && childRef.current) {
      const options = {
        root: parentRef.current,
        rootMargin: '0px',
        threshold: 0,
      };

      observer.current = new IntersectionObserver(([target]) => {
        if (target.isIntersecting) {
          callbackOnIntersect();
        } else if (callbackOnHide) {
          callbackOnHide();
        }
      }, options);

      observer.current.observe(childRef.current);

      return () => {
        observer.current.unobserve(childRef.current);
      };
    }
  }, [callbackOnIntersect, callbackOnHide, parentRef, childRef]);
};

export default useInfiniteScroll;
