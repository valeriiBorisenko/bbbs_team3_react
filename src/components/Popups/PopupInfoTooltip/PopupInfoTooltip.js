import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Lottie from 'lottie-web';
import texts from './locales/RU';
import animationRecommendSuccess from '../../../assets/animation/ill_popup_recommend-success.json';
import Popup from '../Popup/Popup';
import { Button } from '../../utils/index';

function PopupInfoTooltip({ isOpen, onClose }) {
  const animationContainer = useRef(null);

  useEffect(() => {
    Lottie.loadAnimation({
      container: animationContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationRecommendSuccess,
    });
  }, []);

  return (
    <Popup
      type="info-tooltip"
      typeContainer="calendar"
      isOpen={isOpen}
      onClose={onClose}
      sectionClass="popup__container_recommend-success"
    >
      <div ref={animationContainer} className="popup__animation-recommend" />
      <p className="section-title popup__title_type_calendar popup__title_type_recommend-success">
        {texts.popupTitle}
      </p>
      <div className="popup__buttons_type_calendar">
        <Button
          color="black"
          title={texts.buttonText}
          sectionClass="popup__button_type_successfully"
          onClick={onClose}
        />
      </div>
    </Popup>
  );
}

PopupInfoTooltip.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

PopupInfoTooltip.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

export default PopupInfoTooltip;
