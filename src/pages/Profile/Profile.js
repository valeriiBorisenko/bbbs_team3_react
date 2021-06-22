import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './Profile.scss';
import PropTypes from 'prop-types';
import { useSmoothHorizontalScroll, useScrollToTop } from '../../hooks/index';
import {
  BasePage,
  AccountEventCard,
  TitleH2,
  AccountForm,
  AccountDiary,
  PopupDeleteDiary,
} from './index';
import Api from '../../utils/api';

//! Сейчас данные о мероприятиях приходят из App,
//! чтобы синхронизировать отмену записи со стейтом данных календаря.
//! Когда будет готов бэк, она будет приходить в GET-запросе и синхронизироваться через сервер
function Account({ eventsData, onEventFullDescriptionClick }) {
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

  useEffect(() => {
    const sortedEvents = eventsData
      .filter((e) => e.booked)
      .sort((a, b) => {
        const date1 = new Date(a.startAt);
        const date2 = new Date(b.startAt);
        return date1 - date2;
      });
    setEvents(sortedEvents);
  }, [eventsData]);

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
      <section className="account fade-in">
        <div className="account__events-area page__section">
          <TitleH2
            sectionClass="account__title"
            title={
              events && events.length > 0
                ? 'Вы записаны на мероприятия:'
                : 'У вас нет записи на мероприятия'
            }
          />
          <div className="account__events" ref={containerEvents}>
            {events &&
              events.length > 0 &&
              events.map((item) => (
                <AccountEventCard key={item.id} data={item} onOpen={handleOpenEventCard} />
              ))}
          </div>
        </div>

        <div className="account__diaries page__section">
          <span className="account__scroll-anchor" ref={scrollAnchorRef} />
          <div className="account__diaries-container">
            <div className="account__form-container">
              {!isFormOpen && (
                <button
                  className="account__button-add-diary"
                  type="button"
                  onClick={handleOpenForm}
                >
                  Добавить встречу
                </button>
              )}

              {!isEditMode && isFormOpen && (
                <TitleH2
                  sectionClass="account__title"
                  title="Составьте историю вашей дружбы с младшим. Эта страница доступна только вам."
                />
              )}

              <AccountForm
                sectionClass={`${
                  isFormOpen ? 'account__diary-form' : 'account__diary-form_hidden'
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
                <AccountDiary
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

Account.propTypes = {
  eventsData: PropTypes.arrayOf(PropTypes.object),
  onEventFullDescriptionClick: PropTypes.func,
};

Account.defaultProps = {
  eventsData: [],
  onEventFullDescriptionClick: () => {},
};

export default Account;
