import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './Profile.scss';
import PropTypes from 'prop-types';
import { useSmoothHorizontalScroll, useScrollToTop } from '../../hooks/index';
import {
  BasePage,
  ProfileEventCard,
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
  const [isDeleteDiaryPopupOpen, setIsDeleteDiaryPopupOpen] = useState(false);

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

  // работа с карточками мероприятий календаря
  const openEventCard = (data) => {
    onEventFullDescriptionClick(data);
  };

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
    }, 100);
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

  const createDiary = (data) => {
    Api.createDiary(createFormData(data))
      .then((res) => setDiaries([res, ...diaries]))
      .catch(console.log)
      .finally(() => closeForm());
  };

  const editDiary = (data) => {
    Api.editDiary(data.id, createFormData(data))
      .then((res) =>
        setDiaries(() =>
          diaries.map((diary) => (diary.id === res.id ? res : diary))
        )
      )
      .catch(console.log)
      .finally(() => closeForm());
  };

  const submitDiary = (data) => {
    const diary = data;
    if (!diary.mark) {
      diary.mark = 'neutral';
    }
    if (isEditMode) editDiary(diary);
    else createDiary(diary);
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

  const deleteDiary = (diary) => {
    Api.deleteDiary(diary.id, diary)
      .then(() =>
        setDiaries(() =>
          diaries.filter((prev) => (prev.id === diary.id ? null : prev))
        )
      )
      .catch(console.log)
      .finally(() => closeDeleteDiaryPopup());
  };

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
                <ProfileEventCard
                  key={item.id}
                  data={item}
                  onOpen={openEventCard}
                />
              ))}
          </div>
        </div>

        <div className="profile__diaries page__section">
          <span className="profile__scroll-anchor" ref={scrollAnchorRef} />
          <div className="profile__diaries-container">
            <div className="profile__form-container">
              {!isFormOpen && diaries && diaries.length > 0 && (
                <button
                  className="profile__button-add-diary fade-in"
                  type="button"
                  onClick={openForm}
                >
                  Добавить встречу
                </button>
              )}

              {(isFormOpen || (diaries && diaries.length === 0)) && (
                <>
                  {!isEditMode && (
                    <TitleH2
                      sectionClass="profile__title fade-in"
                      title="Составьте историю вашей дружбы с младшим. Эта страница доступна только вам."
                    />
                  )}
                  <ProfileForm
                    sectionClass="profile__diary-form fade-in"
                    isEditMode={isEditMode}
                    isOpen={isFormOpen}
                    data={formDataToEdit}
                    onClose={closeForm}
                    onSubmit={submitDiary}
                  />
                </>
              )}
            </div>

            {diaries &&
              diaries.length > 0 &&
              diaries.map((diary) => (
                <ProfileDiary
                  key={diary.id}
                  data={diary}
                  onEdit={handleEditMode}
                  onDelete={openDeleteDiaryPopup}
                />
              ))}
          </div>
        </div>
      </section>
      <PopupDeleteDiary
        isOpen={isDeleteDiaryPopupOpen}
        cardData={selectedDiary}
        onClose={closeDeleteDiaryPopup}
        onCardDelete={deleteDiary}
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
