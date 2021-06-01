import { useEffect, useState } from 'react';
import './Account.scss';
import { getAccountData } from '../../utils/api';
import AccountEventCard from '../ui/AccountEventCard/AccountEventCard';
import ScrollableByXContainer from '../ui/ScrollableByXContainer/ScrollableByXContainer';
import TitleH2 from '../ui/TitleH2/TitleH2';
import Loader from '../ui/Loader/Loader';
import AccountForm from '../ui/AccountForm/AccountForm';

function Account() {
  const [events, setEvents] = useState(null);

  useEffect(() => {
    getAccountData()
      .then((res) => setEvents(res.data.accountData))
      .catch((err) => console.log(err));
  }, []);

  return (
    <section className="account fade-in">
      <div className="account__events-area page__section">
        {!events ? <Loader /> : (
          <>
            <TitleH2
              sectionClass="account__title"
              title={events.length > 0 ? 'Вы записаны на мероприятия:' : 'У вас нет записи на мероприятия'}
            />
            <ScrollableByXContainer sectionClass="account__events">
              {events.length > 0
            && events.map((item) => (
              <AccountEventCard key={item.id} data={item} />
            ))}
            </ScrollableByXContainer>
          </>
        )}
      </div>

      <div className="account__stories page__section">
        <TitleH2
          sectionClass="account__title"
          title="Составьте историю вашей дружбы с младшим. Эта страница доступна только вам."
        />
        <div className="account__stories-container">
          <AccountForm />
        </div>
      </div>
    </section>
  );
}

export default Account;
