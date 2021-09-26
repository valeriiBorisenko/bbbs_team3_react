import { useEffect } from 'react';

const useCloseOnEscape = (isOpen, callback) => {
  const closeOnEsc = (evt) => {
    if (evt.key === 'Escape') {
      callback();
    }
  };

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keyup', closeOnEsc);
      return () => window.removeEventListener('keyup', closeOnEsc);
    }
  }, [isOpen]);
};

export default useCloseOnEscape;
