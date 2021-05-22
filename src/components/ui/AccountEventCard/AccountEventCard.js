import './AccountEventCard.scss';
import PropTypes from 'prop-types';

function AccountEventCard({ day, month, title }) {
  return (
    <div className="account-event-card">
      <div className="account-event-card__date">
        <span className="account-event-card__day">{day}</span>
        <span className="account-event-card__month">{month}</span>
      </div>
      <p className="account-event-card__title">{title}</p>
    </div>
  );
}

AccountEventCard.propTypes = {
  day: PropTypes.string.isRequired,
  month: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default AccountEventCard;
