import AccountEventCard from '../ui/AccountEventCard/AccountEventCard';
import './Account.scss';

function Account() {
  return (
    <section className="account fade-in">
      {/* по идее эти кнопки должны прилипнуть к хедеру и
      показываться на нём, придумать, как это реализовать */}
      <div className="account__user-info page__section">
        <button className="paragraph account__user-button" type="button">
          Изменить город
        </button>
        <button className="paragraph account__user-button" type="button">
          Выйти
        </button>
      </div>

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
