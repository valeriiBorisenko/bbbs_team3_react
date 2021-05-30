import './AccountEventCard.scss';
import PropTypes from 'prop-types';
import { formatDate } from '../../../utils/utils';
import Card from '../Card/Card';

function AccountEventCard({ data }) {
  const startDay = formatDate(data.startAt);

  return (
    <Card sectionClass="account-event-card">
      <div className="account-event-card__date">
        <span className="account-event-card__day">{startDay.day}</span>
        <span className="account-event-card__month">{startDay.month}</span>
      </div>
      <p className="account-event-card__title">{data.title}</p>
    </Card>
  );
}

AccountEventCard.propTypes = {
  data: PropTypes.objectOf(PropTypes.string).isRequired
};

export default AccountEventCard;
