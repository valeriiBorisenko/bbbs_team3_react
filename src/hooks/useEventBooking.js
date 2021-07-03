import { useContext } from 'react';
import {
  makeEventRegistration,
  cancelEventRegistration,
} from '../api/event-participants';
import {
  setRegisterOnEvent,
  cancelRegisterOnEvent,
} from './useSubscriptionEvents';
import { PopupsContext } from '../contexts/index';

const useEventBooking = () => {
  const { openPopupSuccessfully, openPopupConfirmation, closeAllPopups } =
    useContext(PopupsContext);

  const registerOnEvent = (card) => {
    makeEventRegistration({ event: card.id })
      .then(() => setRegisterOnEvent())
      .then(() => openPopupSuccessfully())
      .catch(console.log);
  };

  const cancelRegistration = (card) => {
    cancelEventRegistration(card.id)
      .then(() => cancelRegisterOnEvent())
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

  return { handleEventBooking, registerOnEvent };
};

export default useEventBooking;
