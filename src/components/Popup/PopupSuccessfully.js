import PropTypes from 'prop-types';
import './Popup.scss';
import '../PopupSuccessfully/PopupSuccessfully.scss';
import svgPic from '../../assets/popup_done.svg';
import Popup from './Popup';
import TitleH2 from '../ui/TitleH2/TitleH2';
import Button from '../ui/Button/Button';
import { formatDate } from '../../utils/utils';

function PopupSuccessfully({
  isOpen,
  onClose,
  data: {
    title,
    startAt,
    endAt
  }
}) {
  const startDay = formatDate(startAt);
  const endDay = formatDate(endAt);
  return (
    <Popup
      type="done"
      isOpen={isOpen}
      onClose={onClose}
    >
      <img className="popup__image-successfully" src={svgPic} alt="красивые бесмысленные фигурки" />
      <TitleH2
        sectionClass="popup__title_type_calendar"
        title={`Вы записаны на мероприятие «${title}» ${startDay.day} ${startDay.month} с ${startDay.hour}:${startDay.minutes} - ${endDay.hour}:${endDay.minutes}`}
      />
      <TitleH2
        sectionClass="popup__title_type_calendar"
        title="Если у вас не получится прийти — отмените, пожалуйста, запись."
      />
      <Button
        color="black"
        title="Вернуться к календарю"
        sectionClass="popup__submit-btn"
        onClick={onClose}
      />
    </Popup>
  );
}

PopupSuccessfully.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.objectOf(PropTypes.any)
};

PopupSuccessfully.defaultProps = {
  isOpen: false,
  onClose: undefined,
  data: {}
};

export default PopupSuccessfully;
