import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Lottie from 'lottie-web';
import animationRecommendSuccess from '../../../assets/animation/ill_popup_recommend-success.json';
import texts from './locales/RU';
import { useCloseOnEscape } from '../../../hooks';
import Popup from '../Popup/Popup';
import { Button } from '../../utils';
import './PopupRecommendSuccess.scss';

function PopupRecommendSuccess({ isOpen, onClose }) {
  useCloseOnEscape(isOpen, onClose);

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
      type="recommend-success"
      typeContainer="calendar"
      isOpen={isOpen}
      onClose={onClose}
      sectionClass="popup__container_recommend-success"
    >
      <div ref={animationContainer} className="popup__animation-recommend" />
      <p className="section-title popup__title_type_calendar popup__title_type_recommend-success">
        {texts.title}
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

PopupRecommendSuccess.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

PopupRecommendSuccess.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

export default PopupRecommendSuccess;
