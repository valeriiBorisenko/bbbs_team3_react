import { useEffect } from 'react';

const useScrollToTop = (...deps) => {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [...deps]);
};

export default useScrollToTop;
