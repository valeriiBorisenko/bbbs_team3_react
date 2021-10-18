import { useContext, useEffect, useState } from 'react';
import {
  getArchiveOfBookedEvents,
  getBookedEvents,
} from '../api/event-participants';
import { ERROR_MESSAGES } from '../config/constants';
import { ErrorsContext, PopupsContext } from '../contexts';

const useProfileEvents = ({ eventsLimit }) => {
  const { openPopupAboutEvent, openPopupError } = useContext(PopupsContext);
  const { setError } = useContext(ErrorsContext);

  const [events, setEvents] = useState([]);
  const [archivedEvents, setArchivedEvents] = useState([]);
  const [eventsOffset, setEventsOffset] = useState(0);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  const getArchiveOfEvents = ({ limit, offset }) => {
    if (offset <= archivedEvents.length) {
      getArchiveOfBookedEvents({ limit, offset })
        .then((eventsData) => {
          setArchivedEvents((prevEvents) => [...prevEvents, ...eventsData]);
          setEventsOffset((prevOffset) => prevOffset + limit);
        })
        .catch(() => {
          setError(ERROR_MESSAGES.generalErrorMessage);
          openPopupError();
        })
        .finally(() => setIsLoadingEvents(false));
    }
  };

  const getCurrentBookedEvents = ({ limit, offset }) => {
    if (offset <= events.length) {
      getBookedEvents({ limit, offset })
        .then((eventsData) => {
          const updatedEvents = eventsData.map(({ event }) => {
            const updatedEvent = event;
            updatedEvent.booked = true;
            return updatedEvent;
          });
          setEvents((prevEvents) => [...prevEvents, ...updatedEvents]);
          setEventsOffset((prevOffset) => prevOffset + limit);
        })
        .catch(() => {
          setError(ERROR_MESSAGES.generalErrorMessage);
          openPopupError();
        })
        .finally(() => setIsLoadingEvents(false));
    }
  };

  const openEventCard = () => {
    if (isArchiveOpen) {
      // без записи на ивент
      openPopupAboutEvent(true);
    } else openPopupAboutEvent();
  };

  const openArchiveOfEvents = () => {
    setEvents([]);
    setEventsOffset(0);
    setIsArchiveOpen(true);
    setIsLoadingEvents(true);
    getArchiveOfEvents({ limit: eventsLimit, offset: 0 });
  };

  const openCurrentEvents = () => {
    setArchivedEvents([]);
    setEventsOffset(0);
    setIsArchiveOpen(false);
    setIsLoadingEvents(true);
    getCurrentBookedEvents({ limit: eventsLimit, offset: 0 });
  };

  useEffect(() => {
    getCurrentBookedEvents({ limit: eventsLimit, offset: eventsOffset });
  }, []);

  return {
    events,
    archivedEvents,
    eventsOffset,
    setEvents,
    getArchiveOfEvents,
    getCurrentBookedEvents,
    isLoadingEvents,
    isArchiveOpen,
    openEventCard,
    openArchiveOfEvents,
    openCurrentEvents,
  };
};

export default useProfileEvents;
