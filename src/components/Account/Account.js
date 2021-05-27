import { useEffect, useState } from 'react';
import './Account.scss';
import { getAccountData } from '../../utils/api';
import { formatDate } from '../../utils/utils';
import Loader from '../ui/Loader/Loader';
import AccountEventCard from '../ui/AccountEventCard/AccountEventCard';

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
        <div className="account__events">
          {events.length > 0
            && events.map((item) => (
              <AccountEventCard
                key={item.id}
                day={formatDate(item.startAt).day}
                month={formatDate(item.startAt).month}
                title={item.title}
              />
            ))}
        </div>
      </div>
    </section>
  ) : (
    <Loader />
  );
}

export default Account;
