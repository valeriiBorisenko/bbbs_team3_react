import './ProfileEventCard.scss';
import PropTypes from 'prop-types';
import texts from './locales/RU';
import { setLocalStorageData } from '../../../hooks/useLocalStorage';
import { localStAfishaEvent } from '../../../config/constants';
import { formatDate } from '../../../utils/utils';
import { Card } from '../../utils/index';

function ProfileEventCard({ data, onOpen, sectionClass }) {
  const startDay = formatDate(data?.startAt);

  const handleOpen = () => {
    setLocalStorageData(localStAfishaEvent, data);
    onOpen();
  };

  return (
    <button
      className={`profile-event-card ${sectionClass}`}
      type="button"
      aria-label={texts.buttonLabel}
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
  sectionClass: PropTypes.string,
};

ProfileEventCard.defaultProps = {
  onOpen: () => {},
  sectionClass: '',
};

export default ProfileEventCard;
