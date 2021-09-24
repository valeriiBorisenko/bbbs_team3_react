import PropTypes from 'prop-types';
import texts from './locales/RU';
import { setLocalStorageData } from '../../../hooks/useLocalStorage';
import { localStAfishaEvent } from '../../../config/constants';
import { formatDate } from '../../../utils/utils';
import { Card } from '../../utils';
import './ProfileEventCard.scss';

function ProfileEventCard({ data, onOpen, sectionClass }) {
  const startDay = formatDate(data?.startAt);

  const handleOpen = () => {
    setLocalStorageData(localStAfishaEvent, data);
    onOpen();
  };

  const buttonClassNames = ['profile-event-card', sectionClass]
    .join(' ')
    .trim();

  const cardClassNames = [
    'profile-event-card__card',
    data?.canceled ? 'profile-event-card__card_canceled' : '',
  ]
    .join(' ')
    .trim();

  const dayClassNames = [
    'profile-event-card__day',
    data?.canceled ? 'profile-event-card__day_canceled' : '',
  ]
    .join(' ')
    .trim();

  const titleClassNames = [
    'profile-event-card__title',
    data?.canceled ? 'profile-event-card__title_canceled' : '',
  ]
    .join(' ')
    .trim();

  return (
    <button
      className={buttonClassNames}
      type="button"
      aria-label={texts.buttonLabel}
      onClick={handleOpen}
    >
      <Card sectionClass={cardClassNames}>
        {data?.canceled && (
          <p className="profile-event-card__text-canceled">
            {texts.eventCanceled}
          </p>
        )}
        <p className={dayClassNames}>{`${startDay?.day}.${startDay?.month}`}</p>
        <p className={titleClassNames}>{data?.title}</p>
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
