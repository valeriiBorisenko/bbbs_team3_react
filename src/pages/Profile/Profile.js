/* eslint-disable no-unused-vars */
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
    Api.getProfileDiaryData()
      .then((diariesData) => {
        setDiaries(diariesData.profileDiaryData);
      })
      .catch((err) => console.log(err));
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

  const handleAddDiary = (data) => {
    if (!isEditMode) {
      const diary = { ...data, id: diaries.length + 1 };
      if (diary.imageUrl.length === 0) {
        // дефолтная картинка, если фото не загружено
        diary.imageUrl =
          'https://i.pinimg.com/originals/f0/e2/53/f0e253b6dbbb809145441ca8fa08b7b7.jpg';
      }
      if (!diary.rate) {
        diary.rate = 'neutral';
      }
      setDiaries([diary, ...diaries]);
    }
    if (isEditMode) {
      setDiaries(() => diaries.map((diary) => (diary.id === data.id ? data : diary)));
    }

    handleCancelForm();
  };

  // выбранная карточка дневника при открытии попапа подтверждения
  const [selectedDiaryCard, setSelectedDiaryCard] = useState({});

  const handleClickPopupDeleteDiary = (card) => {
    setIsPopupDeleteDiaryOpen(true);
    setSelectedDiaryCard(card);
  };

  const closePopupDeleteDiary = () => {
    setIsPopupDeleteDiaryOpen(false);
  };

  const handleCardDelete = (card) => {
    setDiaries(() => diaries.filter((diary) => (diary.id === card.id ? null : diary)));
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
                <AccountEventCard key={item.id} data={item} onOpen={handleOpenEventCard} />
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
                  isFormOpen ? 'profile__diary-form' : 'profile__diary-form_hidden'
                }`}
                isEditMode={isEditMode}
                isOpen={isFormOpen}
                data={formDataToEdit}
                onCancel={handleCancelForm}
                onSubmit={handleAddDiary}
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
        cardData={selectedDiaryCard}
        onClose={closePopupDeleteDiary}
        onCardDelete={handleCardDelete}
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
