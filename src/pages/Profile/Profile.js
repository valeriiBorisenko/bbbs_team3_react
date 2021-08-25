import { useContext, useEffect, useRef, useState } from 'react';
import './Profile.scss';
import profilePageTexts from '../../locales/profile-page-RU';
import { PopupsContext, ErrorsContext } from '../../contexts/index';
import { useEventBooking } from '../../hooks/index';
import {
  getProfileDiariesData,
  createDiary,
  editDiary,
  deleteDiary,
  shareDiary,
} from '../../api/profile-page';
import {
  getBookedEvents,
  getArchiveOfBookedEvents,
} from '../../api/event-participants';
import {
  DELAY_RENDER,
  ERROR_CODES,
  ERROR_MESSAGES,
} from '../../config/constants';
import {
  BasePage,
  ProfileEventCard,
  TitleH2,
  ProfileForm,
  ProfileDiary,
  PopupDeleteDiary,
  ButtonRound,
  Loader,
  ScrollableContainer,
  UserMenuButton,
  AnimatedPageContainer,
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

function Profile() {
  const { openPopupAboutEvent, openPopupError } = useContext(PopupsContext);
  const { setError } = useContext(ErrorsContext);
  const { unauthorized, badRequest } = ERROR_CODES;

  const [events, setEvents] = useState(null);
  const [archivedEvents, setArchivedEvents] = useState(null);
  const [diaries, setDiaries] = useState(null);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formDataToEdit, setFormDataToEdit] = useState(null);
  const [isDeleteDiaryPopupOpen, setIsDeleteDiaryPopupOpen] = useState(false);

  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isPageError, setIsPageError] = useState(false);

  const getArchiveOfEvents = () => {
    getArchiveOfBookedEvents()
      .then((eventsData) => {
        setArchivedEvents(eventsData);
      })
      .catch(() => {
        setError({
          title: ERROR_MESSAGES.generalErrorMessage.title,
          button: ERROR_MESSAGES.generalErrorMessage.button,
        });
        openPopupError();
      })
      .finally(() => setIsLoadingEvents(false));
  };

  const getCurrentBookedEvents = () => {
    getBookedEvents()
      .then((eventsData) => {
        const sortedEvents = eventsData
          .sort((a, b) => {
            const date1 = new Date(a?.event?.startAt);
            const date2 = new Date(b?.event?.startAt);
            return date1 - date2;
          })
          .map(({ event }) => {
            const updatedEvent = event;
            updatedEvent.booked = true;
            return updatedEvent;
          });
        setEvents(sortedEvents);
      })
      .catch(() => setIsPageError(true))
      .finally(() => setIsLoadingEvents(false));
  };

  useEffect(() => {
    getCurrentBookedEvents();
  }, []);

  useEffect(() => {
    getProfileDiariesData()
      .then(setDiaries)
      .catch(() => setIsPageError(true));
  }, []);

  // отписка от ивентов
  const { selectedEvent } = useEventBooking();

  useEffect(() => {
    if (selectedEvent) {
      setEvents(() =>
        events.filter((event) =>
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
    setIsArchiveOpen(true);
    setIsLoadingEvents(true);
    getArchiveOfEvents();
  };

  const openCurrentEvents = () => {
    setIsArchiveOpen(false);
    setIsLoadingEvents(true);
    getCurrentBookedEvents();
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
    if (data?.id) formData.append('id', data?.id);
    if (data?.image) formData.append('image', data?.image);
    formData.append('date', data?.date);
    formData.append('place', data?.place);
    formData.append('description', data?.description);
    formData.append('mark', data?.mark);
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
        setDiaries([newDiary, ...diaries]);
        closeForm();
      })
      .catch((err) => handleErrorOnFormSubmit(err));
  };

  const handleEditDiary = (data) => {
    editDiary(data?.id, createFormData(data))
      .then((newDiary) => {
        setDiaries(() =>
          diaries.map((diary) =>
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
        setDiaries(() =>
          diaries.filter((prevDiary) =>
            prevDiary?.id === diary?.id ? null : prevDiary
          )
        );
        closeDeleteDiaryPopup();
      })
      .catch(() => {
        setError({
          title: ERROR_MESSAGES.generalErrorMessage.title,
          button: ERROR_MESSAGES.generalErrorMessage.button,
        });
        openPopupError();
      });
  };

  const handleShareDiary = (diaryId) => {
    shareDiary(diaryId)
      .then(() => {
        const newDiary = diaries.find((diary) => diary?.id === diaryId);
        newDiary.sentToCurator = true;
        setDiaries(() =>
          diaries.map((diary) =>
            diary?.id === newDiary?.id ? newDiary : diary
          )
        );
      })
      .catch(() => {
        setError({
          title: ERROR_MESSAGES.generalErrorMessage.title,
          button: ERROR_MESSAGES.generalErrorMessage.button,
        });
        openPopupError();
      });
  };

  // функции рендера
  const titleH1Current =
    events?.length > 0 ? eventsTitle : eventsTitleNoResults;
  const titleH1Archive =
    archivedEvents?.length > 0
      ? eventsTitleArchive
      : eventsTitleNoResultsArchive;

  const renderEventCards = () => {
    const renderingEvents = isArchiveOpen ? archivedEvents : events;
    if (renderingEvents && renderingEvents?.length > 0) {
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
  };

  const renderAddDiaryButton = () => {
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
  };

  const renderDiaryForm = () => {
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
  };

  const renderDiaries = () => {
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
  };

  const renderPageContent = () => {
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
              <ScrollableContainer sectionClass="profile__events" step={3}>
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
          </div>
        </div>
      </>
    );
  };

  if (!events && !diaries) {
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
}

export default Profile;
