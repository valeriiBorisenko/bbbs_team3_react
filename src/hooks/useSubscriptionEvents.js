import { useEffect, useState } from 'react';
import { getLocalStorageData } from './useLocalStorage';
import { localStAfishaEvent } from '../config/constants';

export const setRegisterOnEvent = () => {
  const register = new Event('registerEvent');
  window.dispatchEvent(register);
};

export const cancelRegisterOnEvent = () => {
  const cancel = new Event('cancelRegisterEvent');
  window.dispatchEvent(cancel);
};

export const useSubscriptionEvents = () => {
  const [card, setCard] = useState(null);
  const cancel = () => {
    const newEvent = getLocalStorageData(localStAfishaEvent);
    newEvent.booked = false;
    setCard(newEvent);
  };

  const register = () => {
    const newEvent = getLocalStorageData(localStAfishaEvent);
    newEvent.booked = true;
    setCard(newEvent);
  };

  useEffect(() => {
    window.addEventListener('cancelRegisterEvent', cancel);
    window.addEventListener('registerEvent', register);
    return () => {
      window.removeEventListener('cancelRegisterEvent', cancel);
      window.removeEventListener('registerEvent', register);
    };
  }, []);

  return card;
};
