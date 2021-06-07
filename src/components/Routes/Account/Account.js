import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './Account.scss';
import PropTypes from 'prop-types';
import Api from '../../../utils/api';
import { useSmoothScrollOnWindow } from '../../../utils/custom-hooks';
import Loader from '../../ui/Loader/Loader';
import AccountEventCard from '../../ui/AccountEventCard/AccountEventCard';
import ScrollableByXContainer from '../../ui/ScrollableByXContainer/ScrollableByXContainer';
import TitleH2 from '../../ui/TitleH2/TitleH2';
import AccountForm from '../../ui/AccountForm/AccountForm';
import AccountDiary from '../../ui/AccountDiary/AccountDiary';
import PopupDeleteDiary from '../../Popups/PopupDeleteDiary/PopupDeleteDiary';

//! Сейчас данные о мероприятиях приходят из App,
//! чтобы синхронизировать отмену записи со стейтом данных календаря.
//! Когда будет готов бэк, она будет приходить в GET-запросе и синхронизироваться через сервер
function Account({ eventsData, onEventFullDescriptionClick }) {
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
    const sortedEvents = eventsData.filter((e) => e.booked)
      .sort((a, b) => {
        const date1 = new Date(a.startAt);
        const date2 = new Date(b.startAt);
        return date1 - date2;
      });
    setEvents(sortedEvents);
  }, [eventsData]);

  useSmoothScrollOnWindow({ top: 0 });

  const scrollToForm = () => {
    const isMobile = window.innerWidth < 576;
    const isTablet = window.innerWidth > 576 && window.innerWidth < 769;
    let position;

    if (isMobile) {
      position = 240;
    } else if (isTablet) {
      position = 320;
    } else {
      position = 390;
    }

    window.scrollTo({
      top: position,
      behavior: 'smooth'
    });
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
        diary.imageUrl = 'https://i.pinimg.com/originals/f0/e2/53/f0e253b6dbbb809145441ca8fa08b7b7.jpg';
      }
      setDiaries([diary, ...diaries]);
    }
    if (isEditMode) {
      setDiaries(() => diaries.map((diary) => ((diary.id === data.id) ? data : diary)));
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

  if (!events || !diaries) {
    return <Loader />;
  }

  return (
    <>
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
          <ScrollableByXContainer sectionClass="account__events">
            {events && events.length > 0
            && events.map((item) => (
              <AccountEventCard
                key={item.id}
                data={item}
                onOpen={handleOpenEventCard}
              />
            ))}
          </ScrollableByXContainer>
        </div>

        <div className="account__diaries page__section">
          <div className="account__diaries-container">
            <div className="account__form-container">

              {!isFormOpen
                && (
                <button
                  className="account__button-add-diary"
                  type="button"
                  onClick={handleOpenForm}
                >
                  Добавить встречу
                </button>
                )}

              {!isEditMode && isFormOpen
                && (
                <TitleH2
                  sectionClass="account__title"
                  title="Составьте историю вашей дружбы с младшим. Эта страница доступна только вам."
                />
                )}

              <AccountForm
                sectionClass={`${isFormOpen ? 'account__diary-form' : 'account__diary-form_hidden'}`}
                isEditMode={isEditMode}
                isOpen={isFormOpen}
                data={formDataToEdit}
                onCancel={handleCancelForm}
                onSubmit={handleAddDiary}
              />
            </div>

            {diaries && diaries.length > 0 && diaries.map((diary) => (
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
    </>
  );
}

Account.propTypes = {
  eventsData: PropTypes.arrayOf(PropTypes.object),
  onEventFullDescriptionClick: PropTypes.func
};

Account.defaultProps = {
  eventsData: [],
  onEventFullDescriptionClick: () => {}
};

export default Account;
