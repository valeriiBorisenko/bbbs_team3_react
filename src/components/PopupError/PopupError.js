import '../Popup/Popup.scss';
import './PopupError.scss';
import PropTypes from 'prop-types';
import Button from '../ui/Button/Button';
import TitleH2 from '../ui/TitleH2/TitleH2';

function PopupError({ isOpen, onClose }) {
  return (
    <div className={`popup popup_type_error ${isOpen ? 'popup_opened' : ''} `}>
      <div className="popup__container popup__container_type_calendar popup__container_error">
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
      </div>
    </div>
  );
}

PopupError.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

PopupError.defaultProps = {
  isOpen: false,
  onClose: undefined
};

export default PopupError;
