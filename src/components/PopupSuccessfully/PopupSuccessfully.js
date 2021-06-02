import '../Popup/Popup.scss';
import './PopupSuccessfully.scss';
import PropTypes from 'prop-types';
import svgPic from '../../assets/popup_done.svg';
import Popup from '../Popup/Popup';
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
      type="successfully"
      typeContainer="calendar"
      isOpen={isOpen}
      onClose={onClose}
    >
      <img className="popup__image-successfully" src={svgPic} alt="красивые бесмысленные фигурки" />
      <p className="section-title popup__title_type_calendar">Вы записаны на мероприятие</p>
      <TitleH2
        sectionClass="popup__title_type_calendar"
        title={`«${title}»`}
      />
      <TitleH2
        sectionClass="popup__title_type_calendar"
        title={`${startDay.day} ${startDay.monthName} с ${startDay.hour}:${startDay.minutes} - ${endDay.hour}:${endDay.minutes}`}
      />
      <p className="section-title popup__title_type_calendar popup__title_type_successfully">Если у вас не получится прийти — отмените, пожалуйста, запись.</p>
      <div className="popup__buttons_type_calendar">
        <Button
          color="black"
          title="Вернуться к календарю"
          sectionClass="popup__button_type_successfully"
          onClick={onClose}
        />
      </div>
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
