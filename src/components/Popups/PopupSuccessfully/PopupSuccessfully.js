import { useRef, useEffect } from 'react';
import './PopupSuccessfully.scss';
import PropTypes from 'prop-types';
import Lottie from 'lottie-web';
import { formatDate } from '../../../utils/utils';
import {
  animationSuccess, Popup, TitleH2, Button
} from './index';

function PopupSuccessfully({
  isOpen,
  onClose,
  cardData
}) {
  const { title, startAt, endAt } = cardData;
  const startDay = formatDate(startAt);
  const endDay = formatDate(endAt);

  const animationContainer = useRef(null);

  useEffect(() => {
    Lottie.loadAnimation({
      container: animationContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationSuccess
    });
  }, []);

  return (
    <Popup
      type="successfully"
      typeContainer="calendar"
      isOpen={isOpen}
      onClose={onClose}
      sectionClass="popup__container_success"
    >
      <div ref={animationContainer} className="popup__animation-success" />
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
  cardData: PropTypes.objectOf(PropTypes.any)
};

PopupSuccessfully.defaultProps = {
  isOpen: false,
  onClose: () => {},
  cardData: {}
};

export default PopupSuccessfully;
