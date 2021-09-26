import { useLayoutEffect, useState } from 'react';

// Объект maxWindowWidths может содержать максимум 3 поля: small, medium, big

// Объект pageSizeSettings может содержать максимум 4 поля:
// small, medium, big и default
// первые три соответствуют полям объекта windowWidths, default - ВСЕГДА самый большой, как дефолтный

// eslint-disable-next-line consistent-return
const usePageWidth = (maxWindowWidths, pageSizeSettings) => {
  if (maxWindowWidths && pageSizeSettings) {
    const [pageSize, setPageSize] = useState(null);

    useLayoutEffect(() => {
      let smallQuery;
      let mediumQuery;
      let bigQuery;

      if (maxWindowWidths.small) {
        smallQuery = window.matchMedia(
          `(max-width: ${maxWindowWidths.small}px)`
        );
      }
      if (maxWindowWidths.medium) {
        mediumQuery = window.matchMedia(
          `(max-width: ${maxWindowWidths.medium}px)`
        );
      }
      if (maxWindowWidths.big) {
        bigQuery = window.matchMedia(`(max-width: ${maxWindowWidths.big}px)`);
      }

      const listener = () => {
        if (smallQuery && smallQuery.matches) {
          setPageSize(pageSizeSettings.small);
        } else if (mediumQuery && mediumQuery.matches) {
          setPageSize(pageSizeSettings.medium);
        } else if (bigQuery && bigQuery.matches) {
          setPageSize(pageSizeSettings.big);
        } else {
          setPageSize(pageSizeSettings.default);
        }
      };
      listener();

      if (smallQuery) {
        smallQuery.addEventListener('change', listener);
      }

      if (mediumQuery) {
        mediumQuery.addEventListener('change', listener);
      }

      if (bigQuery) {
        bigQuery.addEventListener('change', listener);
      }

      return () => {
        if (smallQuery) {
          smallQuery.removeEventListener('change', listener);
        }

        if (mediumQuery) {
          mediumQuery.removeEventListener('change', listener);
        }

        if (bigQuery) {
          bigQuery.removeEventListener('change', listener);
        }
      };
    }, []);

    return pageSize;
  }
};

export default usePageWidth;
