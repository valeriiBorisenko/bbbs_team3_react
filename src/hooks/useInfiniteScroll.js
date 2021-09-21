import { useLayoutEffect, useRef } from 'react';

const useInfiniteScroll = (parentRef, childRef, callback) => {
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
          callback();
        }
      }, options);

      observer.current.observe(childRef.current);

      return () => {
        observer.current.unobserve(childRef.current);
      };
    }
  }, [callback, parentRef, childRef]);
};

export default useInfiniteScroll;
