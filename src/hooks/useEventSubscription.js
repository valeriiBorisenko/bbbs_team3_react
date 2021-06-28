// import { useEffect } from 'react';
import Api from '../utils/api';

const useEventSubscription = ({
  // cardData,
  // cardId,
  setSelectedCalendarCard,
  handleClickPopupSuccessfullyOpened,
}) => {
  const registerOnEvent = (cardData, cardId) => {
    Api.makeEventRegistration({ event: cardId })
      .then(() => setSelectedCalendarCard(cardData))
      .then(() => handleClickPopupSuccessfullyOpened())
      .catch((error) => console.log(error));
  };

  function cancelEventRegistration(cardData, cardId) {
    Api.cancelEventRegistration(cardId)
      .then(() => console.log('Успешно!'))
      .catch((error) => console.log(error));
  }

  return {
    registerOnEvent,
    cancelEventRegistration,
  };
};

export default useEventSubscription;
