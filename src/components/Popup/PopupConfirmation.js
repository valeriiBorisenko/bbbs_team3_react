import './Popup.scss';
import PropTypes from 'prop-types';
import Popup from './Popup';
import Button from '../ui/Button/Button';
import TitleH2 from '../ui/TitleH2/TitleH2';

function PopupConfirmation({ isOpen, onClose, onClick }) {
  return (
    <Popup
      type="confirmation"
      isOpen={isOpen}
      onClose={onClose}
    >
      <TitleH2
        sectionClass="popup__title_type_calendar popup__title_type_confirmation"
        title="Подтвердить запись на мероприятие «Субботний meet up: учимся проходить интервью» 5 декабря с 12:00–14:00"
      />
      <div className="popup__buttons_type_calendar">
        <Button color="blue" title="Подтвердить запись" sectionClass="button__calendar_type_confirm" onClick={onClick} />
        <Button color="blackwhite" title="Отменить" onClick={onClose} />
      </div>
    </Popup>
  );
}

PopupConfirmation.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onClick: PropTypes.func
};

PopupConfirmation.defaultProps = {
  isOpen: false,
  onClose: undefined,
  onClick: undefined
};

export default PopupConfirmation;
