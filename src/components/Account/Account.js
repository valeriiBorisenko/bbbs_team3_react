import AccountEventCard from '../ui/AccountEventCard/AccountEventCard';
import './Account.scss';

function Account() {
  return (
    <section className="account">
      <div className="account__events-area page__section">
        <h2 className="section-title account__title">Вы записаны на мероприятия:</h2>
        <div className="account__events">
          <AccountEventCard day="05" month="декабрь" title="Субботний meet up: учимся проходить интервью учимся проходить интервью учимся проходить интервью" />
          <AccountEventCard day="16" month="декабрь" title="Ресурсная группа «Вовлечение в волонтёрство» учимся проходить интервью учимся проходить интервью" />
          <AccountEventCard day="05" month="декабрь" title="Субботний meet up: учимся проходить интервью учимся проходить интервью учимся проходить интервью" />
          <AccountEventCard day="16" month="декабрь" title="Ресурсная группа «Вовлечение в волонтёрство» учимся проходить интервью учимся проходить интервью" />
          <AccountEventCard day="05" month="декабрь" title="Субботний meet up: учимся проходить интервью учимся проходить интервью учимся проходить интервью" />
          <AccountEventCard day="05" month="декабрь" title="Субботний meet up: учимся проходить интервью учимся проходить интервью учимся проходить интервью" />
          <AccountEventCard day="16" month="декабрь" title="Ресурсная группа «Вовлечение в волонтёрство» учимся проходить интервью учимся проходить интервью" />
          <AccountEventCard day="05" month="декабрь" title="Субботний meet up: учимся проходить интервью учимся проходить интервью учимся проходить интервью" />
        </div>
      </div>
    </section>
  );
}

export default Account;
