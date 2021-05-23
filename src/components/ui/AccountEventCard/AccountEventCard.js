import './AccountEventCard.scss';
import PropTypes from 'prop-types';
import Card from '../Card/Card';

function AccountEventCard({ day, month, title }) {
  return (
    <Card sectionClass="account-event-card">
      <div className="account-event-card__date">
        <span className="account-event-card__day">{day}</span>
        <span className="account-event-card__month">{month}</span>
      </div>
      <p className="account-event-card__title">{title}</p>
    </Card>
  );
}

AccountEventCard.propTypes = {
  day: PropTypes.string,
  month: PropTypes.string,
  title: PropTypes.string
};

AccountEventCard.defaultProps = {
  day: '',
  month: '',
  title: ''
};

export default AccountEventCard;
