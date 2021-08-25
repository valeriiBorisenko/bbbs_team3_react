import { useRef, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import './PopupSuccessfully.scss';
import PropTypes from 'prop-types';
import Lottie from 'lottie-web';
import animationSuccess from '../../../assets/animation/ill_popup_success.json';
import texts from './locales/RU';
import { AFISHA_URL } from '../../../config/routes';
import { formatDate } from '../../../utils/utils';
import { getLocalStorageData } from '../../../hooks/useLocalStorage';
import { localStAfishaEvent } from '../../../config/constants';
import Popup from '../Popup/Popup';
import { TitleH2, Button } from '../../utils/index';

const { popupTitle, paragraph, buttonTextCalendarPage, buttonTextDefault } =
  texts;

function PopupSuccessfully({ isOpen, onClose }) {
  const { pathname } = useLocation();
  const history = useHistory();

  const card = getLocalStorageData(localStAfishaEvent);
  const startDay = formatDate(card?.startAt);
  const endDay = formatDate(card?.endAt);

  const pushToCalendar = () => {
    history.push(AFISHA_URL);
  };

  const buttonText =
    pathname === AFISHA_URL ? buttonTextCalendarPage : buttonTextDefault;

  const actionOnButtonClick =
    pathname === AFISHA_URL ? onClose : pushToCalendar;

  const animationContainer = useRef(null);

  useEffect(() => {
    Lottie.loadAnimation({
      container: animationContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationSuccess,
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
      <p className="section-title popup__title_type_calendar">{popupTitle}</p>
      <TitleH2
        sectionClass="popup__title_type_calendar"
        title={`«${card?.title}»`}
      />
      <TitleH2
        sectionClass="popup__title_type_calendar"
        title={`${startDay?.day} ${startDay?.monthName} с ${startDay?.hour}:${startDay?.minutes} - ${endDay?.hour}:${endDay?.minutes}`}
      />
      <p className="section-title popup__title_type_calendar popup__title_type_successfully">
        {paragraph}
      </p>
      <div className="popup__buttons_type_calendar">
        <Button
          color="black"
          title={buttonText}
          sectionClass="popup__button_type_successfully"
          onClick={actionOnButtonClick}
        />
      </div>
    </Popup>
  );
}

PopupSuccessfully.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

PopupSuccessfully.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

export default PopupSuccessfully;
