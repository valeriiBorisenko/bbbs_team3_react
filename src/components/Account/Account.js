import { useEffect, useState } from 'react';
import './Account.scss';
import { getAccountData, getAccountDiaryData } from '../../utils/api';
import { useSmoothScrollOnWindow } from '../../utils/custom-hooks';
import Loader from '../ui/Loader/Loader';
import AccountEventCard from '../ui/AccountEventCard/AccountEventCard';
import ScrollableByXContainer from '../ui/ScrollableByXContainer/ScrollableByXContainer';
import TitleH2 from '../ui/TitleH2/TitleH2';
import AccountForm from '../ui/AccountForm/AccountForm';
import AccountDiary from '../ui/AccountDiary/AccountDiary';

function Account() {
  const [events, setEvents] = useState(null);
  const [diaries, setDiaries] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    Promise.all([getAccountData(), getAccountDiaryData()])
      .then(([accountData, diaryData]) => {
        setEvents(accountData.data.accountData);
        setDiaries(diaryData.data.accountDiaryData);
      })
      .catch((err) => console.log(err));
  }, []);

  useSmoothScrollOnWindow({ top: 0 });

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
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
              <AccountEventCard key={item.id} data={item} />
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
                onCancel={handleCancelForm}
              />
            </div>

            {diaries.map((diary) => (
              <AccountDiary key={diary.id} data={diary} />
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

export default Account;
