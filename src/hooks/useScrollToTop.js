import { useEffect } from 'react';

// прокрутка к верху страницы
const useScrollToTop = (...deps) => {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [...deps]);
};

export default useScrollToTop;
