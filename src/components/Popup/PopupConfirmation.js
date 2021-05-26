import './Popup.scss';
import PropTypes from 'prop-types';
import Popup from './Popup';
import Button from '../ui/Button/Button';
import TitleH2 from '../ui/TitleH2/TitleH2';

function PopupConfirmation({ isOpen, onClose, onConfirmFormSubmit }) {
  function submitHandler(event) {
    event.preventDefault();
    onConfirmFormSubmit();
  }

  return (
    <Popup
      type="confirmation"
      isOpen={isOpen}
      onClose={onClose}
    >
      {/* пропс title и время должны приходить из-вне
      ((клик по карточке подтягивает инфу в конфирм-попап))
      так же осложняет то что в строке еще дата есть, которую так
      же надо подтягивать (еще 1 пропс нужен)
      */}
      <TitleH2
        sectionClass="popup__title_type_calendar"
        title="Подтвердить запись на мероприятие «Субботний meet up: учимся проходить интервью» 5 декабря с 12:00–14:00"
      />
      <div className="popup__buttons_type_calendar">
        <Button
          color="blue"
          title="Подтвердить запись"
          sectionClass="button__calendar_type_confirm"
          onClick={submitHandler}
          isSubmittable
        />
        <Button
          color="black"
          title="Отменить"
          onClick={onClose}
        />
      </div>
    </Popup>
  );
}

PopupConfirmation.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirmFormSubmit: PropTypes.func
};

PopupConfirmation.defaultProps = {
  isOpen: false,
  onClose: undefined,
  onConfirmFormSubmit: undefined
};

export default PopupConfirmation;
