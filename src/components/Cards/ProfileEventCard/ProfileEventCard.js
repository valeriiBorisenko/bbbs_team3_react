import './ProfileEventCard.scss';
import PropTypes from 'prop-types';
import { formatDate } from '../../../utils/utils';
import Card from '../../utils/Card/Card';

function ProfileEventCard({ data, onOpen }) {
  const startDay = formatDate(data.startAt);

  const handleOpen = () => {
    onOpen(data);
  };

  return (
    <Card sectionClass="profile-event-card" onClick={handleOpen}>
      <div className="profile-event-card__date">
        <span className="profile-event-card__day">{startDay.day}</span>
        <span className="profile-event-card__month">{startDay.monthName}</span>
      </div>
      <p className="profile-event-card__title">{data.title}</p>
    </Card>
  );
}

ProfileEventCard.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  onOpen: PropTypes.func,
};

ProfileEventCard.defaultProps = {
  onOpen: () => {},
};

export default ProfileEventCard;
