import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './Profile.scss';
import PropTypes from 'prop-types';
import { useSmoothHorizontalScroll, useScrollToTop } from '../../hooks/index';
import {
  BasePage,
  AccountEventCard,
  TitleH2,
  ProfileForm,
  ProfileDiary,
  PopupDeleteDiary,
} from './index';
import Api from '../../utils/api';

function Profile({ onEventFullDescriptionClick }) {
  useScrollToTop();

  const [events, setEvents] = useState(null);
  const [diaries, setDiaries] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formDataToEdit, setFormDataToEdit] = useState(null);
  const [isPopupDeleteDiaryOpen, setIsPopupDeleteDiaryOpen] = useState(false);

  useEffect(() => {
    Promise.all([Api.getCalendarPageData(), Api.getBookedEvents()])
      .then(([calendarData, participantsData]) => {
        const eventIds = participantsData.map((event) => event.event);
        const bookedEvents = calendarData.filter((event) =>
          eventIds.includes(event.id)
        );
        setEvents(bookedEvents);
      })
      .catch(console.log);
  }, []);

  useEffect(() => {
    Api.getProfileDiariesData().then(setDiaries).catch(console.log);
  }, []);

  const scrollAnchorRef = useRef(null);
  const scrollToForm = () => {
    scrollAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenForm = (data) => {
    if (!data) {
      setIsEditMode(false);
    }
    setIsFormOpen(true);
    scrollToForm();
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setIsEditMode(false);
    setFormDataToEdit(null);
  };

  const handleEditDiaryCard = (data) => {
    setIsEditMode(true);
    setFormDataToEdit(data);
    handleOpenForm(data);
  };

  const handleOpenEventCard = (data) => {
    onEventFullDescriptionClick(data);
  };

  const createFormData = (data) => {
    const formData = new FormData();
    if (data.id) formData.append('id', data.id);
    formData.append('date', data.date);
    formData.append('image', data.image);
    formData.append('place', data.place);
    formData.append('description', data.description);
    formData.append('mark', data.mark);
    return formData;
  };

  const handleCreateDiary = (data) => {
    Api.createDiary(createFormData(data))
      .then((res) => setDiaries([res, ...diaries]))
      .catch(console.log);
  };

  const handleEditDiary = (data) => {
    Api.editDiary(data.id, createFormData(data))
      .then((res) =>
        setDiaries(() =>
          diaries.map((diary) => (diary.id === res.id ? res : diary))
        )
      )
      .catch(console.log);
  };

  const handleSubmitDiary = (data) => {
    const diary = data;
    if (!diary.mark) {
      diary.mark = 'neutral';
    }
    if (isEditMode) handleEditDiary(diary);
    else handleCreateDiary(diary);
    handleCancelForm();
  };

  // выбранная карточка дневника при открытии попапа подтверждения
  const [selectedDiary, setSelectedDiary] = useState({});

  const handleClickPopupDeleteDiary = (diary) => {
    setIsPopupDeleteDiaryOpen(true);
    setSelectedDiary(diary);
  };

  const closePopupDeleteDiary = () => {
    setIsPopupDeleteDiaryOpen(false);
  };

  const handleDeleteDiary = (diary) => {
    Api.deleteDiary(diary.id, diary)
      .then(() =>
        setDiaries(() =>
          diaries.filter((prev) => (prev.id === diary.id ? null : prev))
        )
      )
      .catch(console.log);

    closePopupDeleteDiary();
  };

  // скролл контейнера с карточками мероприятий
  const containerEvents = useSmoothHorizontalScroll({ step: 3 });

  return (
    <BasePage>
      <Helmet>
        <title>Личный кабинет</title>
        <meta name="description" content="Личный кабинет наставника" />
      </Helmet>
      <section className="profile fade-in">
        <div className="profile__events-area page__section">
          <TitleH2
            sectionClass="profile__title"
            title={
              events && events.length > 0
                ? 'Вы записаны на мероприятия:'
                : 'У вас нет записи на мероприятия'
            }
          />
          <div className="profile__events" ref={containerEvents}>
            {events &&
              events.length > 0 &&
              events.map((item) => (
                <AccountEventCard
                  key={item.id}
                  data={item}
                  onOpen={handleOpenEventCard}
                />
              ))}
          </div>
        </div>

        <div className="profile__diaries page__section">
          <span className="profile__scroll-anchor" ref={scrollAnchorRef} />
          <div className="profile__diaries-container">
            <div className="profile__form-container">
              {!isFormOpen && (
                <button
                  className="profile__button-add-diary"
                  type="button"
                  onClick={handleOpenForm}
                >
                  Добавить встречу
                </button>
              )}

              {!isEditMode && isFormOpen && (
                <TitleH2
                  sectionClass="profile__title"
                  title="Составьте историю вашей дружбы с младшим. Эта страница доступна только вам."
                />
              )}

              <ProfileForm
                sectionClass={`${
                  isFormOpen
                    ? 'profile__diary-form'
                    : 'profile__diary-form_hidden'
                }`}
                isEditMode={isEditMode}
                isOpen={isFormOpen}
                data={formDataToEdit}
                onCancel={handleCancelForm}
                onSubmit={handleSubmitDiary}
              />
            </div>

            {diaries &&
              diaries.length > 0 &&
              diaries.map((diary) => (
                <ProfileDiary
                  key={diary.id}
                  data={diary}
                  onEdit={handleEditDiaryCard}
                  onDelete={handleClickPopupDeleteDiary}
                />
              ))}
          </div>
        </div>
      </section>
      <PopupDeleteDiary
        isOpen={isPopupDeleteDiaryOpen}
        cardData={selectedDiary}
        onClose={closePopupDeleteDiary}
        onCardDelete={handleDeleteDiary}
      />
    </BasePage>
  );
}

Profile.propTypes = {
  onEventFullDescriptionClick: PropTypes.func,
};

Profile.defaultProps = {
  onEventFullDescriptionClick: () => {},
};

export default Profile;
