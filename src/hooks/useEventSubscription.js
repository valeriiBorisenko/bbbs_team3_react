// import { useEffect } from 'react';
import Api from '../utils/api';

const useEventSubscription = ({
  // cardData,
  // cardId,
  setSelectedCalendarCard,
  handleClickPopupSuccessfullyOpened,
  setIsPopupAboutDescriptionOpen,
  handleClickPopupConfirmationOpened,
}) => {
  //! А если передать в хук функцию-сеттер массива карточек, а внутри пробежаться по нему и покрасить карточку в этом сеттере?

  const registerOnEvent = (cardData, cardId) => {
    Api.makeEventRegistration({ event: cardId })
      .then(() => setSelectedCalendarCard(cardData))
      .then(() => handleClickPopupSuccessfullyOpened())
      .catch((error) => console.log(error));
  };

  const cancelEventRegistration = (cardData, cardId) => {
    Api.cancelEventRegistration(cardId)
      .then(() => console.log('Успешно!'))
      .catch((error) => console.log(error));
  };

  const handleEventBooking = (cardData, cardId, isEventBooked) => {
    console.log('bookingHandler');
    console.log(cardData);
    console.log(cardId);
    console.log(isEventBooked);
    // console.log(cardData.id);
    // console.log(isEventBooked);
    if (isEventBooked) {
      console.log('мы не записаны');
      // мы записаны на ивент, надо отписаться
      cancelEventRegistration(cardData, cardId);
    } else {
      console.log('мы не записаны');
      // мы НЕ записаны на ивент, надо открыть попап "подтвердите"
      setSelectedCalendarCard(cardData); // отмечаем карточку
      setIsPopupAboutDescriptionOpen(false); // закрываем попап подробно
      handleClickPopupConfirmationOpened(); // открываем попап "подтвердите"
    }
  };

  return {
    registerOnEvent,
    // cancelEventRegistration,
    handleEventBooking,
  };
};

export default useEventSubscription;
