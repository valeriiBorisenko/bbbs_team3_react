import { useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Lottie from 'lottie-web';
import animationSuccess from '../../../assets/animation/ill_popup_success.json';
import texts from './locales/RU';
import { AFISHA_URL } from '../../../config/routes';
import { localStAfishaEvent } from '../../../config/constants';
import { formatDate, formatMonthsGenitiveCase } from '../../../utils/utils';
import { getLocalStorageData } from '../../../hooks/useLocalStorage';
import Popup from '../Popup/Popup';
import { Button, Heading, Paragraph } from '../../utils';
import './PopupSuccessfully.scss';

const { popupTitle, paragraph, buttonTextCalendarPage, buttonTextDefault } =
  texts;

function PopupSuccessfully({ isOpen, onClose }) {
  const { pathname } = useLocation();
  const history = useHistory();

  const card = getLocalStorageData(localStAfishaEvent);
  const startDay = formatDate(card?.startAt);
  const endDay = formatDate(card?.endAt);
  const month = formatMonthsGenitiveCase(startDay?.monthName);

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
      <Heading
        level={2}
        type="small"
        content={popupTitle}
        sectionClass="popup__title_type_calendar"
      />
      <Paragraph
        size="big"
        sectionClass="popup__title_type_calendar"
        content={`«${card?.title}»`}
      />
      <Paragraph
        size="big"
        sectionClass="popup__title_type_calendar"
        content={`${parseInt(startDay?.day, 10)} ${month} с ${startDay?.hour}:${
          startDay?.minutes
        }—${endDay?.hour}:${endDay?.minutes}`}
      />
      <Paragraph
        size="big"
        content={paragraph}
        sectionClass="popup__title_type_calendar popup__title_type_successfully"
      />
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
  onClose: undefined,
};

export default PopupSuccessfully;
