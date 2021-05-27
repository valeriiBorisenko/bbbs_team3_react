import PropTypes from 'prop-types';
import './Popup.scss';
import '../PopupSuccessfully/PopupSuccessfully.scss';
import svgPic from '../../assets/popup_done.svg';
import Popup from './Popup';
import TitleH2 from '../ui/TitleH2/TitleH2';
import Button from '../ui/Button/Button';

function PopupSuccessfully({
  isOpen,
  onClose,
  data: {
    title,
    startAt,
    endAt
  }
}) {
  return (
    //! поработать над представлением даты в нормальном виде (startAt и endsAt)
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
        title={`Подтвердить запись на мероприятие "${title}" ${startAt} ${endAt}`}
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
