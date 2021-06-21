import { useEffect } from 'react';

const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
};

export default useScrollToTop;
