import { useContext, useEffect, useState } from 'react';
import {
  cancelEventRegistration,
  makeEventRegistration,
} from '../api/event-participants';
import { ErrorsContext, PopupsContext } from '../contexts';
import { getLocalStorageData } from './useLocalStorage';
import { ERROR_MESSAGES, localStAfishaEvent } from '../config/constants';

// хук отслеживает события записи и отписки от ивента
const useEventBooking = () => {
  const {
    openPopupSuccessfully,
    openPopupConfirmation,
    closeAllPopups,
    openPopupError,
  } = useContext(PopupsContext);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);
  const { setError } = useContext(ErrorsContext);

  // события отписки и регистрации на мероприятие
  const setRegisterEvent = () => {
    const register = new Event('registerEvent');
    window.dispatchEvent(register);
  };

  const setCancelRegisterEvent = () => {
    const cancel = new Event('cancelRegisterEvent');
    window.dispatchEvent(cancel);
  };

  // объект кладётся в localStorage при клике на карточку на странице
  // обработчики событий берут объект произошедшего события из localStorage и меняют им свойство booked
  // затем этот объект передается на страницу для отрисовки
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

  // функции-утилиты, запускающие события, их используют компоненты
  const registerOnEvent = (card) => {
    setIsWaitingResponse(true);
    makeEventRegistration({ event: card.id })
      .then(() => setRegisterEvent())
      .then(() => closeAllPopups())
      .then(() => openPopupSuccessfully())
      .catch(() => {
        setError(ERROR_MESSAGES.eventAddErrorMessage);
        openPopupError();
      })
      .finally(() => setIsWaitingResponse(false));
  };

  const cancelRegistration = (card) => {
    setIsWaitingResponse(true);
    cancelEventRegistration(card.id)
      .then(() => setCancelRegisterEvent())
      .then(() => closeAllPopups())
      .catch(() => {
        setError(ERROR_MESSAGES.eventCancelErrorMessage);
        openPopupError();
      })
      .finally(() => setIsWaitingResponse(false));
  };

  const handleEventBooking = (card, noConfirm) => {
    if (card.booked) {
      // мы записаны на ивент, надо отписаться
      cancelRegistration(card);
    } else if (noConfirm) {
      registerOnEvent(card);
    } else {
      // мы НЕ записаны на ивент
      closeAllPopups(); // закрываем попап подробно
      openPopupConfirmation(); // открываем попап "подтвердите"
    }
  };

  return {
    handleEventBooking,
    registerOnEvent,
    selectedEvent,
    isWaitingResponse,
  };
};

export default useEventBooking;
