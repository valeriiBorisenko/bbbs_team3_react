import { useEffect, useState } from 'react';
import './Account.scss';
import PropTypes from 'prop-types';
import { getAccountData, getAccountDiaryData } from '../../utils/api';
import { useSmoothScrollOnWindow } from '../../utils/custom-hooks';
import Loader from '../ui/Loader/Loader';
import AccountEventCard from '../ui/AccountEventCard/AccountEventCard';
import ScrollableByXContainer from '../ui/ScrollableByXContainer/ScrollableByXContainer';
import TitleH2 from '../ui/TitleH2/TitleH2';
import AccountForm from '../ui/AccountForm/AccountForm';
import AccountDiary from '../ui/AccountDiary/AccountDiary';

// TODO при отмене записи обновить массив карточек в стейте и перерендерить

function Account({ onDiaryDelete, onEventFullDescriptionClick }) {
  const [events, setEvents] = useState(null);
  const [diaries, setDiaries] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formDataToEdit, setFormDataToEdit] = useState(null);

  // сортируем все ивенты по хронологии
  const sortAndFilterEvents = (data) => data
    .filter((e) => e.booked)
    .sort((a, b) => {
      const date1 = new Date(a.startAt);
      const date2 = new Date(b.startAt);
      return date1 - date2;
    });

  useEffect(() => {
    Promise.all([getAccountData(), getAccountDiaryData()])
      .then(([calendarData, diaryData]) => {
        const bookedEvents = sortAndFilterEvents(calendarData.data.calendarPageData);
        setEvents(bookedEvents);
        setDiaries(diaryData.data.accountDiaryData);
      })
      .catch((err) => console.log(err));
  }, []);

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

  const handleOpenForm = () => {
    setFormDataToEdit({});
    setIsFormOpen(true);
    scrollToForm();
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
  };

  const handleEditDiaryCard = (data) => {
    setFormDataToEdit(data);
    setIsFormOpen(true);
    scrollToForm();
  };

  const handleDeleteDiaryCard = (card) => {
    onDiaryDelete(card);
  };

  const handleOpenEventCard = (data) => {
    onEventFullDescriptionClick(data);
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
            events.length > 0
              ? 'Вы записаны на мероприятия:'
              : 'У вас нет записи на мероприятия'
          }
        />
        <ScrollableByXContainer sectionClass="account__events">
          {events.length > 0
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
        {diaries.length > 0 ? (
          <div className="account__diaries-container">
            <div className="account__form-container">
              <button
                className="account__button-add-diary"
                type="button"
                onClick={handleOpenForm}
              >
                Добавить встречу
              </button>
              <AccountForm
                sectionClass={`${isFormOpen ? 'account__diary-form' : 'account__diary-form_hidden'}`}
                isOpen={isFormOpen}
                data={formDataToEdit || {}}
                onCancel={handleCancelForm}
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
            <AccountForm />
          </>
        )}
      </div>
    </section>
  );
}

Account.propTypes = {
  onDiaryDelete: PropTypes.func,
  onEventFullDescriptionClick: PropTypes.func
};

Account.defaultProps = {
  onDiaryDelete: undefined,
  onEventFullDescriptionClick: undefined
};

export default Account;
