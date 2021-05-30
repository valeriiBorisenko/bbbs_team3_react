import { useEffect, useState } from 'react';
import './Account.scss';
import { getAccountData } from '../../utils/api';
import Loader from '../ui/Loader/Loader';
import AccountEventCard from '../ui/AccountEventCard/AccountEventCard';
import ScrollableByXContainer from '../ui/ScrollableByXContainer/ScrollableByXContainer';

function Account() {
  const [events, setEvents] = useState(null);

  useEffect(() => {
    getAccountData()
      .then((res) => setEvents(res.data.accountData))
      .catch((err) => console.log(err));
  }, []);

  return events ? (
    <section className="account fade-in">
      <div className="account__events-area page__section">
        <h2 className="section-title account__title">
          {events.length > 0
            ? 'Вы записаны на мероприятия:'
            : 'У вас нет записи на мероприятия'}
        </h2>
        <ScrollableByXContainer sectionClass="account__events">
          {events.length > 0
            && events.map((item) => (
              <AccountEventCard key={item.id} data={item} />
            ))}
        </ScrollableByXContainer>
      </div>
    </section>
  ) : (
    <Loader />
  );
}

export default Account;
