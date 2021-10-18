import { useContext, useEffect, useRef, useState } from 'react';
import profilePageTexts from './locales/RU';
import { ErrorsContext, PopupsContext } from '../../contexts';
import {
  DELAY_RENDER,
  ERROR_CODES,
  ERROR_MESSAGES,
} from '../../config/constants';
import { useEventBooking, useFiltrationAndPagination } from '../../hooks';
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
  AnimatedPageContainer,
  BasePage,
  ButtonRound,
  Heading,
  Loader,
  Paginate,
  PopupDeleteDiary,
  ProfileDiary,
  ProfileEventCard,
  ProfileForm,
  ScrollableContainer,
  UserMenuButton,
} from './index';
import './Profile.scss';

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

const { unauthorized, badRequest } = ERROR_CODES;

const diariesPerPageCount = 10;
const eventsLimit = 10;

function Profile() {
  const { openPopupAboutEvent, openPopupError } = useContext(PopupsContext);
  const { serverError, setError } = useContext(ErrorsContext);

  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [archivedEvents, setArchivedEvents] = useState([]);
  const [eventsOffset, setEventsOffset] = useState(0);

  const [diaries, setDiaries] = useState([]);
  // удаление дневника
  const [selectedDiary, setSelectedDiary] = useState({});

  const [isWaitingResponse, setIsWaitingResponse] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formDataToEdit, setFormDataToEdit] = useState(null);
  const [isDeleteDiaryPopupOpen, setIsDeleteDiaryPopupOpen] = useState(false);

  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isPageError, setIsPageError] = useState(false);

  // якорь для скролла при работе с дневниками
  const scrollAnchorRef = useRef(null);

  const titleH1Current = events.length > 0 ? eventsTitle : eventsTitleNoResults;
  const titleH1Archive =
    archivedEvents.length > 0
      ? eventsTitleArchive
      : eventsTitleNoResultsArchive;

  // пагинация
  const filtersAndPaginationSettings = {
    apiGetDataCallback: getProfileDiariesData,
    pageSize: diariesPerPageCount,
    setIsPageError,
  };

  const {
    dataToRender,
    isPageLoading,
    isPaginationUsed,
    totalPages,
    pageIndex,
    changePageIndex,
  } = useFiltrationAndPagination(filtersAndPaginationSettings);

  useEffect(() => {
    setDiaries(dataToRender);
  }, [dataToRender]);

  useEffect(() => {
    getCurrentBookedEvents({ limit: eventsLimit, offset: eventsOffset });
  }, []);

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

  // эффект при переключении страниц пагинации
  useEffect(() => {
    if (scrollAnchorRef && scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView();
    }
    if (isFormOpen) closeForm();
  }, [pageIndex]);

  if (isPageLoading) {
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
        isWaitingResponse={isWaitingResponse && isDeleteDiaryPopupOpen}
      />
    </>
  );

  // функционал
  // КАРТОЧКИ ИВЕНТОВ
  function getArchiveOfEvents({ limit, offset }) {
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
  }

  function getCurrentBookedEvents({ limit, offset }) {
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
  }

  function openEventCard() {
    if (isArchiveOpen) {
      // без записи на ивент
      openPopupAboutEvent(true);
    } else openPopupAboutEvent();
  }

  function openArchiveOfEvents() {
    setEvents([]);
    setEventsOffset(0);
    setIsArchiveOpen(true);
    setIsLoadingEvents(true);
    getArchiveOfEvents({ limit: eventsLimit, offset: 0 });
  }

  function openCurrentEvents() {
    setArchivedEvents([]);
    setEventsOffset(0);
    setIsArchiveOpen(false);
    setIsLoadingEvents(true);
    getCurrentBookedEvents({ limit: eventsLimit, offset: 0 });
  }

  // ФОРМА И ДНЕВНИКИ
  function scrollToForm() {
    scrollAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  function openForm(data) {
    if (!data) setIsEditMode(false);
    setIsFormOpen(true);
    scrollToForm();
  }

  function closeForm() {
    setIsFormOpen(false);
    setIsEditMode(false);
    setFormDataToEdit(null);
  }

  function handleEditMode(data) {
    setIsFormOpen(false);
    //! небольшая задержка перед ререндером
    setTimeout(() => {
      setIsEditMode(true);
      setFormDataToEdit(data);
      openForm(data);
    }, DELAY_RENDER);
  }

  function createFormData(data) {
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
  }

  function handleErrorOnFormSubmit(err) {
    if (err?.status === badRequest || err?.status === unauthorized) {
      setError(err?.data);
    } else openPopupError();
  }

  function handleCreateDiary(data) {
    createDiary(createFormData(data))
      .then((newDiary) => {
        setDiaries((prevDiaries) => [newDiary, ...prevDiaries]);
        closeForm();
      })
      .catch((err) => handleErrorOnFormSubmit(err))
      .finally(() => setIsWaitingResponse(false));
  }

  function handleEditDiary(data) {
    editDiary(data?.id, createFormData(data))
      .then((newDiary) => {
        setDiaries((prevDiaries) =>
          prevDiaries.map((diary) =>
            diary?.id === newDiary?.id ? newDiary : diary
          )
        );
        closeForm();
      })
      .catch((err) => handleErrorOnFormSubmit(err))
      .finally(() => setIsWaitingResponse(false));
  }

  function handleSubmitDiary(data) {
    setIsWaitingResponse(true);
    if (isEditMode) handleEditDiary(data);
    else handleCreateDiary(data);
  }

  function handleShareDiary(sharedDiary) {
    setIsWaitingResponse(true);
    setSelectedDiary(sharedDiary);
    shareDiary(sharedDiary?.id)
      .then(() => {
        const newDiary = diaries.find((diary) => diary?.id === sharedDiary?.id);
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
      })
      .finally(() => setIsWaitingResponse(false));
  }

  // УДАЛЕНИЕ ДНЕВНИКА
  function openDeleteDiaryPopup(diary) {
    setIsDeleteDiaryPopupOpen(true);
    setSelectedDiary(diary);
  }

  function closeDeleteDiaryPopup() {
    setIsDeleteDiaryPopupOpen(false);
  }

  function handleDeleteDiary(diary) {
    setIsWaitingResponse(true);
    deleteDiary(diary?.id)
      .then(() => {
        setDiaries((prevDiaries) =>
          prevDiaries.filter((prevDiary) =>
            prevDiary?.id === diary?.id ? null : prevDiary
          )
        );
      })
      .catch(() => {
        setError(ERROR_MESSAGES.generalErrorMessage);
        openPopupError();
      })
      .finally(() => {
        setIsWaitingResponse(false);
        closeDeleteDiaryPopup();
      });
  }

  // РЕНДЕРИНГ
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
    if (isFormOpen || (diaries && diaries.length === 0 && !isPageLoading)) {
      return (
        <div className="profile__form-container">
          {!isEditMode && (
            <Heading
              level={2}
              type="small"
              sectionClass="profile__title fade-in"
              content={formTitle}
            />
          )}
          <ProfileForm
            sectionClass="profile__diary-form scale-in"
            isEditMode={isEditMode}
            isOpen={isFormOpen}
            data={formDataToEdit}
            onClose={closeForm}
            onSubmit={handleSubmitDiary}
            isWaitingResponse={isWaitingResponse}
          />
        </div>
      );
    }
    return null;
  }

  function renderDiaries() {
    if (isPaginationUsed) return <Loader isPaginate />;

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
              selectedDiaryId={selectedDiary?.id}
              isWaitingResponse={isWaitingResponse && !isDeleteDiaryPopupOpen}
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
                <Heading
                  level={2}
                  type="small"
                  sectionClass="profile__title profile__title_shifted"
                  content={isArchiveOpen ? titleH1Archive : titleH1Current}
                />
              </div>
              {(events.length > 0 || archivedEvents.length > 0) && (
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
              )}
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

            {totalPages > 1 && (
              <Paginate
                sectionClass="cards-section__pagination"
                pageCount={totalPages}
                value={pageIndex}
                onChange={changePageIndex}
                dontUseScrollUp
              />
            )}
          </div>
        </div>
      </>
    );
  }
}

export default Profile;
