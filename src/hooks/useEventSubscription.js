/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
import { useEffect, useState } from 'react';

export const setRegisterOnEvent = (cardData) => {
  const register = new Event('registerEvent');
  window.dispatchEvent(register);
};

export const cancelRegisterOnEvent = (cardData) => {
  const cancel = new Event('cancelRegisterEvent');
  window.dispatchEvent(cancel);
};

const useEventSubscription = (setState) => {
  const register = () => {
    // console.log({ card });
  };

  const cancel = () => {
    // console.log(card);
  };

  // useEffect(() => {
  //   if (setState) {
  //     console.log('active');
  //     window.addEventListener('registerEvent', register);
  //     window.addEventListener('cancelRegisterEvent', cancel);
  //     return () => {
  //       console.log('deleted');
  //       window.removeEventListener('registerEvent', register);
  //       window.removeEventListener('cancelRegisterEvent', cancel);
  //     };
  //   }
  // if (registerCallback) {
  //   console.log('register is active');
  //   window.addEventListener('registerEvent', registerCallback);
  //   return () => {
  //     console.log('register is deleted');
  //     window.removeEventListener('registerEvent', registerCallback);
  //   };
  // }
  // }, []);
};

export default useEventSubscription;
