import PropTypes from 'prop-types';
import './Popup.scss';
import '../PopupSuccessfully/PopupSuccessfully.scss';
import svgPic from '../../assets/popup_done.svg';
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
      {/* пропс title и время должны приходить из-вне
      ((клик по карточке подтягивает инфу в конфирм-попап))
      так же осложняет то что в строке еще дата есть, которую так
      же надо подтягивать (еще 1 пропс нужен)
      */}
      <img className="popup__image-successfully" src={svgPic} alt="красивые бесмысленные фигурки" />
      <TitleH2
        sectionClass="popup__title_type_calendar"
        title="Вы записаны на мероприятие «Субботний meet up: учимся проходить интервью» 5 декабря с 12:00–14:00."
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
  onClose: PropTypes.func
};

PopupSuccessfully.defaultProps = {
  isOpen: false,
  onClose: undefined
};

export default PopupSuccessfully;
