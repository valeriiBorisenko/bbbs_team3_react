import { useEffect, useState } from 'react';
import './Account.scss';
import PropTypes from 'prop-types';
import { getProfileDiaryData } from '../../utils/api';
import { useSmoothScrollOnWindow } from '../../utils/custom-hooks';
import Loader from '../ui/Loader/Loader';
import AccountEventCard from '../ui/AccountEventCard/AccountEventCard';
import ScrollableByXContainer from '../ui/ScrollableByXContainer/ScrollableByXContainer';
import TitleH2 from '../ui/TitleH2/TitleH2';
import AccountForm from '../ui/AccountForm/AccountForm';
import AccountDiary from '../ui/AccountDiary/AccountDiary';

//! Сейчас данные о мероприятиях приходят из App,
//! чтобы синхронизировать отмену записи со стейтом данных календаря.
//! Когда будет готов бэк, она будет приходить в GET-запросе и синхронизироваться через сервер

function Account({ eventsData, onDiaryDelete, onEventFullDescriptionClick }) {
  const [events, setEvents] = useState(null);
  const [diaries, setDiaries] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formDataToEdit, setFormDataToEdit] = useState(null);
  const [diaryFormInputValues, setDiaryFormInputValues] = useState({});

  console.log({ diaryFormInputValues });

  useEffect(() => {
    getProfileDiaryData()
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
      position = 280;
    } else if (isTablet) {
      position = 390;
    } else {
      position = 430;
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

  const handleDeleteDiaryCard = (card) => {
    onDiaryDelete(card);
  };

  const handleOpenEventCard = (data) => {
    onEventFullDescriptionClick(data);
    console.log(data);
  };

  if (!events || !diaries) {
    return <Loader />;
  }

  return (
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
        {diaries && diaries.length > 0 ? (
          <div className="account__diaries-container">
            <div className="account__form-container">
              <button
                className="account__button-add-diary"
                type="button"
                onClick={handleOpenForm}
                disabled={isEditMode}
              >
                Добавить встречу
              </button>
              <AccountForm
                sectionClass={`${isFormOpen ? 'account__diary-form' : 'account__diary-form_hidden'}`}
                isEditMode={isEditMode}
                isOpen={isFormOpen}
                data={formDataToEdit}
                onCancel={handleCancelForm}
                inputValues={diaryFormInputValues}
                setInputValues={setDiaryFormInputValues}
              />
            </div>

            {diaries.map((diary) => (
              <AccountDiary
                key={diary.id}
                data={diary}
                onEdit={handleEditDiaryCard}
                onDelete={handleDeleteDiaryCard}
              />
            ))}
          </div>
        ) : (
          <>
            <TitleH2
              sectionClass="account__title"
              title="Составьте историю вашей дружбы с младшим. Эта страница доступна только вам."
            />
            <AccountForm
              sectionClass="account__diary-form"
              isEditMode={isEditMode}
              isOpen={isFormOpen}
              data={formDataToEdit}
              onCancel={handleCancelForm}
              inputValues={diaryFormInputValues}
              setInputValues={setDiaryFormInputValues}
            />
          </>
        )}
      </div>
    </section>
  );
}

Account.propTypes = {
  eventsData: PropTypes.arrayOf(PropTypes.object),
  onDiaryDelete: PropTypes.func,
  onEventFullDescriptionClick: PropTypes.func
};

Account.defaultProps = {
  eventsData: [],
  onDiaryDelete: undefined,
  onEventFullDescriptionClick: undefined
};

export default Account;
