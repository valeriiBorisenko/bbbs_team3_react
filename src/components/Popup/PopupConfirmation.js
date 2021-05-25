import './Popup.scss';
import PropTypes from 'prop-types';
import Popup from './Popup';
import Button from '../ui/Button/Button';

function PopupConfirmation({ isOpen, onClose }) {
  return (
    <Popup
      type="confirmation"
      isOpen={isOpen}
      onClose={onClose}
    >
      <h2 className="section-title calendar__title_type_popup calendar__title_type_confirmation">
        Подтвердить запись на мероприятие «Субботний meet up: учимся проходить интервью» 5 декабря
        с 12:00–14:00
      </h2>
      <div className="calendar__buttons">
        <Button color="blue" title="Подтвердить запись" />
        <Button color="white" title="Отменить" onClick={onClose} />
      </div>
    </Popup>
  );
}

PopupConfirmation.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

PopupConfirmation.defaultProps = {
  isOpen: false,
  onClose: undefined
};

export default PopupConfirmation;
