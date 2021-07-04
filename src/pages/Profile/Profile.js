import { useContext, useEffect, useRef, useState } from 'react';
import './Profile.scss';
import profilePageTexts from '../../locales/profile-page-RU';
import { CurrentUserContext, PopupsContext } from '../../contexts/index';
import {
  useSmoothHorizontalScroll,
  useScrollToTop,
  useEventBooking,
} from '../../hooks/index';
import {
  getProfileDiariesData,
  createDiary,
  editDiary,
  deleteDiary,
} from '../../api/profile-page';
import { getBookedEvents } from '../../api/event-participants';
import { DELAY_RENDER } from '../../config/constants';
import {
  BasePage,
  ProfileEventCard,
  TitleH2,
  ProfileForm,
  ProfileDiary,
  PopupDeleteDiary,
  ButtonRound,
  Loader,
} from './index';

function Profile() {
  const {
    headTitle,
    headDescription,
    eventsTitle,
    eventsTitleNoResults,
    formTitle,
  } = profilePageTexts;

  useScrollToTop();

  const { currentUser } = useContext(CurrentUserContext);
  const { openPopupAboutEvent } = useContext(PopupsContext);

  const [events, setEvents] = useState(null);
  const [diaries, setDiaries] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formDataToEdit, setFormDataToEdit] = useState(null);
  const [isDeleteDiaryPopupOpen, setIsDeleteDiaryPopupOpen] = useState(false);

  useEffect(() => {
    getBookedEvents()
      .then((eventsData) =>
        setEvents(() =>
          eventsData.map(({ event }) => {
            const updatedEvent = event;
            updatedEvent.booked = true;
            return updatedEvent;
          })
        )
      )
      .catch(console.log);
  }, [currentUser?.city]);

  useEffect(() => {
    getProfileDiariesData().then(setDiaries).catch(console.log);
  }, []);

  // отписка от ивентов
  const { selectedEvent } = useEventBooking();

  useEffect(() => {
    if (selectedEvent) {
      setEvents(() =>
        events.filter((event) => (event.id === selectedEvent.id ? null : event))
      );
    }
  }, [selectedEvent]);

  // работа с карточками мероприятий календаря
  const openEventCard = () => openPopupAboutEvent();

  // скролл контейнера с карточками мероприятий
  const containerEvents = useSmoothHorizontalScroll({ step: 3 });

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
    //! необходима небольшая задержка перед ререндером
    setTimeout(() => {
      setIsEditMode(true);
      setFormDataToEdit(data);
      openForm(data);
    }, DELAY_RENDER);
  };

  const createFormData = (data) => {
    const formData = new FormData();
    if (data.id) formData.append('id', data.id);
    if (data.image) formData.append('image', data.image);
    formData.append('date', data.date);
    formData.append('place', data.place);
    formData.append('description', data.description);
    formData.append('mark', data.mark);
    return formData;
  };

  const handleCreateDiary = (data) => {
    createDiary(createFormData(data))
      .then((res) => setDiaries([res, ...diaries]))
      .catch(console.log)
      .finally(() => closeForm());
  };

  const handleEditDiary = (data) => {
    editDiary(data.id, createFormData(data))
      .then((res) =>
        setDiaries(() =>
          diaries.map((diary) => (diary.id === res.id ? res : diary))
        )
      )
      .catch(console.log)
      .finally(() => closeForm());
  };

  const handleSubmitDiary = (data) => {
    const diary = data;
    if (!diary.mark) {
      diary.mark = 'neutral';
    }
    if (isEditMode) handleEditDiary(diary);
    else handleCreateDiary(diary);
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
    deleteDiary(diary.id, diary)
      .then(() =>
        setDiaries(() =>
          diaries.filter((prev) => (prev.id === diary.id ? null : prev))
        )
      )
      .catch(console.log)
      .finally(() => closeDeleteDiaryPopup());
  };

  // функции рендера
  const titleH1 = events?.length > 0 ? eventsTitle : eventsTitleNoResults;

  const renderEventCards = () => {
    if (events && events.length > 0) {
      return (
        <>
          {events.map((item) => (
            <ProfileEventCard
              key={item?.id}
              data={item}
              onOpen={openEventCard}
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
        <ButtonRound
          sectionClass="profile__button-add-diary fade-in"
          color="blue"
          isSmall
          onClick={openForm}
        />
      );
    }
    return null;
  };

  const renderDiaryForm = () => {
    if (isFormOpen || (diaries && diaries.length === 0)) {
      return (
        <>
          {!isEditMode && (
            <TitleH2 sectionClass="profile__title fade-in" title={formTitle} />
          )}
          <ProfileForm
            sectionClass="profile__diary-form fade-in"
            isEditMode={isEditMode}
            isOpen={isFormOpen}
            data={formDataToEdit}
            onClose={closeForm}
            onSubmit={handleSubmitDiary}
          />
        </>
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
              key={diary.id}
              data={diary}
              onEdit={handleEditMode}
              onDelete={openDeleteDiaryPopup}
            />
          ))}
        </>
      );
    }
    return null;
  };

  if (!events && !diaries) {
    return <Loader isCentered />;
  }

  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      <section className="profile fade-in">
        <div className="profile__events-area page__section">
          <TitleH2 sectionClass="profile__title" title={titleH1} />
          <div className="profile__events" ref={containerEvents}>
            {renderEventCards()}
          </div>
        </div>

        <div className="profile__diaries page__section">
          <span className="profile__scroll-anchor" ref={scrollAnchorRef} />
          <div className="profile__diaries-container">
            <div className="profile__form-container">
              {renderAddDiaryButton()}

              {renderDiaryForm()}
            </div>

            {renderDiaries()}
          </div>
        </div>
      </section>
      <PopupDeleteDiary
        isOpen={isDeleteDiaryPopupOpen}
        cardData={selectedDiary}
        onClose={closeDeleteDiaryPopup}
        onCardDelete={handleDeleteDiary}
      />
    </BasePage>
  );
}

export default Profile;
