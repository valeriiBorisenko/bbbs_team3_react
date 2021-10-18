import PropTypes from 'prop-types';
import texts from './locales/RU';
import { setLocalStorageData } from '../../../hooks/useLocalStorage';
import { localStAfishaEvent } from '../../../config/constants';
import { formatDate, refineClassNames } from '../../../utils/utils';
import { Card } from '../../utils';
import './ProfileEventCard.scss';

function ProfileEventCard({ data, onOpen, sectionClass }) {
  const startDay = formatDate(data?.startAt);

  const handleOpen = () => {
    setLocalStorageData(localStAfishaEvent, data);
    onOpen();
  };

  const classNames = {
    main: refineClassNames(['profile-event-card', sectionClass]),
    card: refineClassNames([
      'profile-event-card__card',
      data?.canceled ? 'profile-event-card__card_canceled' : '',
    ]),
    day: refineClassNames([
      'profile-event-card__day',
      data?.canceled ? 'profile-event-card__day_canceled' : '',
    ]),
    title: refineClassNames([
      'profile-event-card__title',
      data?.canceled ? 'profile-event-card__title_canceled' : '',
    ]),
  };

  return (
    <button
      className={classNames.main}
      type="button"
      aria-label={texts.buttonLabel}
      onClick={handleOpen}
    >
      <Card sectionClass={classNames.card}>
        {data?.canceled && (
          <p className="profile-event-card__text-canceled">
            {texts.eventCanceled}
          </p>
        )}
        <p
          className={classNames.day}
        >{`${startDay?.day}.${startDay?.month}`}</p>
        <p className={classNames.title}>{data?.title}</p>
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
  onOpen: undefined,
  sectionClass: '',
};

export default ProfileEventCard;
