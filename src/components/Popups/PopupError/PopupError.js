import './PopupError.scss';
import PropTypes from 'prop-types';
import { Popup, Button, TitleH2 } from './index';

function PopupError({ isOpen, onClose }) {
  return (
    <Popup
      type="error"
      typeContainer="calendar"
      sectionClass="popup__container_error"
      isOpen={isOpen}
      onClose={onClose}
    >
      <TitleH2
        sectionClass="popup__title_type_calendar popup__title_type_error"
        title="Что-то пошло не так, попробуйте записаться снова"
      />
      <div className="popup__buttons_type_calendar">
        <Button
          color="black"
          title="Вернуться к мероприятию"
          sectionClass="popup__button_type_error"
          onClick={onClose}
        />
      </div>
    </Popup>
  );
}

PopupError.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

PopupError.defaultProps = {
  isOpen: false,
  onClose: () => {}
};

export default PopupError;
