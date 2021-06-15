import './AccountEventCard.scss';
import PropTypes from 'prop-types';
import { formatDate } from '../../../utils/utils';
import Card from '../../utils/Card/Card';

function AccountEventCard({
  data, onOpen
}) {
  const startDay = formatDate(data.startAt);

  const handleOpen = () => {
    onOpen(data);
  };

  return (
    <Card sectionClass="account-event-card" onClick={handleOpen}>
      <div className="account-event-card__date">
        <span className="account-event-card__day">{startDay.day}</span>
        <span className="account-event-card__month">{startDay.monthName}</span>
      </div>
      <p className="account-event-card__title">{data.title}</p>
    </Card>
  );
}

AccountEventCard.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  onOpen: PropTypes.func
};

AccountEventCard.defaultProps = {
  onOpen: () => {}
};

export default AccountEventCard;
