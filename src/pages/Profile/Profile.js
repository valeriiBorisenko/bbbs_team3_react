import { useContext, useEffect, useRef, useState } from 'react';
import './Profile.scss';
import profilePageTexts from '../../locales/profile-page-RU';
import { ErrorsContext, PopupsContext } from '../../contexts';
import { useEventBooking } from '../../hooks';
import {
  createDiary,
  deleteDiary,
  editDiary,
  getProfileDiariesData,
  shareDiary,
} from '../../api/profile-page';
import {
  getArchiveOfBookedEvents,
  getBookedEvents,
} from '../../api/event-participants';
import {
  DELAY_RENDER,
  ERROR_CODES,
  ERROR_MESSAGES,
} from '../../config/constants';
import {
  AnimatedPageContainer,
  BasePage,
  ButtonRound,
  Loader,
  Paginate,
  PopupDeleteDiary,
  ProfileDiary,
  ProfileEventCard,
  ProfileForm,
  ScrollableContainer,
  TitleH2,
  UserMenuButton,
} from './index';

const {
  headTitle,
  headDescription,
  eventsTitle,
  eventsTitleNoResults,
  formTitle,
  eventsArchiveButton,
  eventsCurrentButton,
  eventsTitleArchive,
  eventsTitleNoResultsArchive,
} = profilePageTexts;

const diariesPerPageCount = 10;
const eventsLimit = 10;

function Profile() {
  const { openPopupAboutEvent, openPopupError } = useContext(PopupsContext);
  const { serverError, setError } = useContext(ErrorsContext);
  const { unauthorized, badRequest } = ERROR_CODES;

  const [events, setEvents] = useState([]);
  const [archivedEvents, setArchivedEvents] = useState([]);
  const [eventsOffset, setEventsOffset] = useState(0);

  const [diaries, setDiaries] = useState(null);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formDataToEdit, setFormDataToEdit] = useState(null);
  const [isDeleteDiaryPopupOpen, setIsDeleteDiaryPopupOpen] = useState(false);

  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isPageError, setIsPageError] = useState(false);

  const titleH1Current = events.length > 0 ? eventsTitle : eventsTitleNoResults;
  const titleH1Archive =
    archivedEvents.length > 0
      ? eventsTitleArchive
      : eventsTitleNoResultsArchive;

  // пагинация
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [isLoadingPaginate, setIsLoadingPaginate] = useState(false);

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
        .catch(() => setIsPageError(true))
        .finally(() => setIsLoadingEvents(false));
    }
  };

  const getDiaries = () => {
    const offset = diariesPerPageCount * pageIndex;

    getProfileDiariesData({ limit: diariesPerPageCount, offset })
      .then(({ results, count }) => {
        setDiaries(results);
        setPageCount(Math.ceil(count / diariesPerPageCount));
      })
      .catch(() => setIsPageError(true))
      .finally(() => setIsLoadingPaginate(false));
  };

  useEffect(() => {
    getCurrentBookedEvents({ limit: eventsLimit, offset: eventsOffset });
  }, []);

  useEffect(() => {
    setIsLoadingPaginate(true);
    getDiaries();
  }, [pageIndex]);

  // отписка от ивентов
  const { selectedEvent } = useEventBooking();

  useEffect(() => {
    if (selectedEvent) {
      setEvents((prevEvents) =>
        prevEvents.filter((event) =>
          event?.id === selectedEvent?.id ? null : event
        )
      );
    }
  }, [selectedEvent]);

  // работа с карточками мероприятий календаря
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

  // работа с формой
  const scrollAnchorRef = useRef(null);
  const scrollToForm = () => {
    scrollAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const openForm = (data) => {
    if (!data) setIsEditMode(false);
    setIsFormOpen(true);
    scrollToForm();
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setIsEditMode(false);
    setFormDataToEdit(null);
  };

  const handleEditMode = (data) => {
    setIsFormOpen(false);
    //! небольшая задержка перед ререндером
    setTimeout(() => {
      setIsEditMode(true);
      setFormDataToEdit(data);
      openForm(data);
    }, DELAY_RENDER);
  };

  const createFormData = (data) => {
    const formData = new FormData();
    if (data) {
      if (data.id) formData.append('id', data.id);
      if (data.image) formData.append('image', data.image);
      formData.append('date', data.date);
      formData.append('place', data.place);
      formData.append('description', data.description);
      formData.append('mark', data.mark);
    }
    return formData;
  };

  const handleErrorOnFormSubmit = (err) => {
    if (err?.status === badRequest || err?.status === unauthorized) {
      setError(err?.data);
    } else openPopupError();
  };

  const handleCreateDiary = (data) => {
    createDiary(createFormData(data))
      .then((newDiary) => {
        setDiaries((prevDiaries) => [newDiary, ...prevDiaries]);
        closeForm();
      })
      .catch((err) => handleErrorOnFormSubmit(err));
  };

  const handleEditDiary = (data) => {
    editDiary(data?.id, createFormData(data))
      .then((newDiary) => {
        setDiaries((prevDiaries) =>
          prevDiaries.map((diary) =>
            diary?.id === newDiary?.id ? newDiary : diary
          )
        );
        closeForm();
      })
      .catch((err) => handleErrorOnFormSubmit(err));
  };

  const handleSubmitDiary = (data) => {
    if (isEditMode) handleEditDiary(data);
    else handleCreateDiary(data);
  };

  // удаление дневника
  const [selectedDiary, setSelectedDiary] = useState({});

  const openDeleteDiaryPopup = (diary) => {
    setIsDeleteDiaryPopupOpen(true);
    setSelectedDiary(diary);
  };

  const closeDeleteDiaryPopup = () => {
    setIsDeleteDiaryPopupOpen(false);
  };

  const handleDeleteDiary = (diary) => {
    deleteDiary(diary?.id, diary)
      .then(() => {
        setDiaries((prevDiaries) =>
          prevDiaries.filter((prevDiary) =>
            prevDiary?.id === diary?.id ? null : prevDiary
          )
        );
        closeDeleteDiaryPopup();
      })
      .catch(() => {
        setError(ERROR_MESSAGES.generalErrorMessage);
        openPopupError();
      });
  };

  const handleShareDiary = (diaryId) => {
    shareDiary(diaryId)
      .then(() => {
        const newDiary = diaries.find((diary) => diary?.id === diaryId);
        newDiary.sentToCurator = true;
        setDiaries((prevDiaries) =>
          prevDiaries.map((diary) =>
            diary?.id === newDiary?.id ? newDiary : diary
          )
        );
      })
      .catch(() => {
        setError(ERROR_MESSAGES.generalErrorMessage);
        openPopupError();
      });
  };

  if (!events.length && !diaries) {
    return <Loader isCentered />;
  }

  return (
    <>
      <BasePage headTitle={headTitle} headDescription={headDescription}>
        <section className="profile fade-in">{renderPageContent()}</section>
      </BasePage>
      <PopupDeleteDiary
        isOpen={isDeleteDiaryPopupOpen}
        cardData={selectedDiary}
        onClose={closeDeleteDiaryPopup}
        onCardDelete={handleDeleteDiary}
      />
    </>
  );

  // функции рендера
  function renderEventCards() {
    const renderingEvents = isArchiveOpen ? archivedEvents : events;
    if (renderingEvents.length > 0) {
      return (
        <>
          {renderingEvents.map((item) => (
            <ProfileEventCard
              key={item?.id}
              data={item}
              onOpen={openEventCard}
              sectionClass="scrollable-container__child slide-in"
            />
          ))}
        </>
      );
    }
    return null;
  }

  function renderAddDiaryButton() {
    if (!isFormOpen && diaries && diaries.length > 0) {
      return (
        <button
          className="profile__button-add-diary fade-in"
          type="button"
          onClick={openForm}
        >
          <ButtonRound color="blue" isSmall isSpan />
        </button>
      );
    }
    return null;
  }

  function renderDiaryForm() {
    if (isFormOpen || (diaries && diaries.length === 0)) {
      return (
        <div className="profile__form-container">
          {!isEditMode && (
            <TitleH2 sectionClass="profile__title fade-in" title={formTitle} />
          )}
          <ProfileForm
            sectionClass="profile__diary-form scale-in"
            isEditMode={isEditMode}
            isOpen={isFormOpen}
            data={formDataToEdit}
            onClose={closeForm}
            onSubmit={handleSubmitDiary}
          />
        </div>
      );
    }
    return null;
  }

  function renderDiaries() {
    if (isLoadingPaginate) return <Loader isPaginate />;
    if (diaries && diaries.length > 0) {
      return (
        <>
          {diaries.map((diary) => (
            <ProfileDiary
              key={diary?.id}
              data={diary}
              onEdit={handleEditMode}
              onDelete={openDeleteDiaryPopup}
              onShare={handleShareDiary}
              sectionClass="scale-in"
            />
          ))}
        </>
      );
    }
    return null;
  }

  function renderPageContent() {
    if (isPageError) {
      return (
        <AnimatedPageContainer
          titleText={ERROR_MESSAGES.generalErrorMessage.title}
        />
      );
    }
    return (
      <>
        <div className="profile__events-area page__section">
          {!isLoadingEvents ? (
            <>
              <div className="profile__events-heading">
                <UserMenuButton
                  sectionClass="profile__archive-button"
                  title={
                    isArchiveOpen ? eventsCurrentButton : eventsArchiveButton
                  }
                  handleClick={
                    isArchiveOpen ? openCurrentEvents : openArchiveOfEvents
                  }
                />
                <TitleH2
                  sectionClass="profile__title profile__title_shifted"
                  title={isArchiveOpen ? titleH1Archive : titleH1Current}
                />
              </div>
              <ScrollableContainer
                sectionClass="profile__events"
                step={3}
                onScrollCallback={() => {
                  if (!serverError) {
                    if (isArchiveOpen) {
                      getArchiveOfEvents({
                        limit: eventsLimit,
                        offset: eventsOffset,
                      });
                    } else {
                      getCurrentBookedEvents({
                        limit: eventsLimit,
                        offset: eventsOffset,
                      });
                    }
                  }
                }}
              >
                {renderEventCards()}
              </ScrollableContainer>
            </>
          ) : (
            <Loader isSmallGrid />
          )}
        </div>

        <div className="profile__diaries page__section">
          <span className="profile__scroll-anchor" ref={scrollAnchorRef} />
          <div className="profile__diaries-container">
            {renderAddDiaryButton()}

            {renderDiaryForm()}

            {renderDiaries()}

            {pageCount > 1 && (
              <Paginate
                sectionClass="cards-section__pagination"
                pageCount={pageCount}
                value={pageIndex}
                onChange={setPageIndex}
              />
            )}
          </div>
        </div>
      </>
    );
  }
}

export default Profile;
