import { useContext, useState, useEffect } from 'react';
import {
  makeEventRegistration,
  cancelEventRegistration,
} from '../api/event-participants';
import { PopupsContext } from '../contexts/index';
import { getLocalStorageData } from './useLocalStorage';
import { localStAfishaEvent } from '../config/constants';

const useEventBooking = () => {
  const { openPopupSuccessfully, openPopupConfirmation, closeAllPopups } =
    useContext(PopupsContext);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const setRegisterEvent = () => {
    const register = new Event('registerEvent');
    window.dispatchEvent(register);
  };

  const setCancelRegisterEvent = () => {
    const cancel = new Event('cancelRegisterEvent');
    window.dispatchEvent(cancel);
  };

  const listenCancel = () => {
    const newEvent = getLocalStorageData(localStAfishaEvent);
    newEvent.booked = false;
    setSelectedEvent(newEvent);
  };

  const listenRegister = () => {
    const newEvent = getLocalStorageData(localStAfishaEvent);
    newEvent.booked = true;
    setSelectedEvent(newEvent);
  };

  useEffect(() => {
    window.addEventListener('cancelRegisterEvent', listenCancel);
    window.addEventListener('registerEvent', listenRegister);
    return () => {
      window.removeEventListener('cancelRegisterEvent', listenCancel);
      window.removeEventListener('registerEvent', listenRegister);
    };
  }, []);

  const registerOnEvent = (card) => {
    makeEventRegistration({ event: card.id })
      .then(() => setRegisterEvent())
      .then(() => openPopupSuccessfully())
      .catch(console.log);
  };

  const cancelRegistration = (card) => {
    cancelEventRegistration(card.id)
      .then(() => setCancelRegisterEvent())
      .then(() => closeAllPopups())
      .catch(console.log);
  };

  const handleEventBooking = (card) => {
    if (card.booked) {
      // мы записаны на ивент, надо отписаться
      cancelRegistration(card);
    } else {
      // мы НЕ записаны на ивент
      closeAllPopups(); // закрываем попап подробно
      openPopupConfirmation(); // открываем попап "подтвердите"
    }
  };

  return { handleEventBooking, registerOnEvent, selectedEvent };
};

export default useEventBooking;
