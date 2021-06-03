import './AccountEventCard.scss';
import PropTypes from 'prop-types';
import { formatDate } from '../../../utils/utils';
import Card from '../Card/Card';

function AccountEventCard({
  data: {
    address,
    booked: isBooked,
    contact,
    description,
    endAt,
    remainSeats,
    startAt,
    tags,
    title
  }, onOpen
}) {
  const startDay = formatDate(startAt);

  const handleOpen = () => {
    onOpen({
      address,
      isBooked,
      contact,
      description,
      endAt,
      remainSeats,
      startAt,
      tags,
      title
    });
  };

  return (
    <Card sectionClass="account-event-card" onClick={handleOpen}>
      <div className="account-event-card__date">
        <span className="account-event-card__day">{startDay.day}</span>
        <span className="account-event-card__month">{startDay.monthName}</span>
      </div>
      <p className="account-event-card__title">{title}</p>
    </Card>
  );
}

AccountEventCard.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  onOpen: PropTypes.func
};

AccountEventCard.defaultProps = {
  onOpen: undefined
};

export default AccountEventCard;
