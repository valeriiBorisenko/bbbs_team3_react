import './Popup.scss';
import '../PopupSuccessfully/PopupSuccessfully.scss';
import PropTypes from 'prop-types';
import Popup from './Popup';
import TitleH2 from '../ui/TitleH2/TitleH2';
import Button from '../ui/Button/Button';

function PopupSuccessfully({ isOpen, onClose }) {
  return (
    <Popup
      type="done"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="popup__image-successfully" />
      <TitleH2
        sectionClass="popup__title_type_calendar"
        title="Вы записаны на мероприятие «Субботний meet up: учимся проходить интервью» 5 декабря с 12:00–14:00."
      />
      <TitleH2
        sectionClass="popup__title_type_calendar"
        title="Если у вас не получится прийти — отмените, пожалуйста, запись."
      />
      <Button color="black" title="Вернуться к календарю" onClick={onClose} />
    </Popup>
  );
}

PopupSuccessfully.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

PopupSuccessfully.defaultProps = {
  isOpen: false,
  onClose: undefined
};

export default PopupSuccessfully;
