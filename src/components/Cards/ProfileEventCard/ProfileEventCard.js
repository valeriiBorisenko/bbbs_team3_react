import './ProfileEventCard.scss';
import PropTypes from 'prop-types';
import { formatDate } from '../../../utils/utils';
import Card from '../../utils/Card/Card';
import { setLocalStorageData } from '../../../hooks/useLocalStorage';
import { localStAfishaEvent } from '../../../config/constants';

function ProfileEventCard({ data, onOpen }) {
  const startDay = formatDate(data?.startAt);

  const handleOpen = () => {
    setLocalStorageData(localStAfishaEvent, data);
    onOpen();
  };

  return (
    <button
      className="profile-event-card"
      type="button"
      aria-label="Открыть карточку"
      onClick={handleOpen}
    >
      <Card sectionClass="profile-event-card__card">
        <div className="profile-event-card__date">
          <span className="profile-event-card__day">{startDay?.day}</span>
          <span className="profile-event-card__month">
            {startDay?.monthName}
          </span>
        </div>
        <p className="profile-event-card__title">{data?.title}</p>
      </Card>
    </button>
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
