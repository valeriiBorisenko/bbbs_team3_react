import '../PopupSuccessfully/PopupSuccessfully.scss';
import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Lottie from 'lottie-web';
import {
  animationRecommendSuccess, Popup, Button
} from './index';

function PopupRecommendSuccess({ isOpen, onClose }) {
  const animationContainer = useRef(null);

  useEffect(() => {
    Lottie.loadAnimation({
      container: animationContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationRecommendSuccess
    });
  }, []);

  return (
    <Popup
      type="recommend-success"
      typeContainer="calendar"
      isOpen={isOpen}
      onClose={onClose}
      sectionClass="popup__container_success"
    >
      <div ref={animationContainer} className="popup__animation-success" />
      <p className="section-title popup__title_type_calendar popup__title_type_successfully">
        Спасибо, мы проверим информацию, и скоро все пользователи смогут увидеть вашу рекомендацию
      </p>
      <div className="popup__buttons_type_calendar">
        <Button
          color="black"
          title="Вернуться к рекомендациям"
          sectionClass="popup__button_type_successfully"
          onClick={onClose}
        />
      </div>
    </Popup>
  );
}

PopupRecommendSuccess.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

PopupRecommendSuccess.defaultProps = {
  isOpen: false,
  onClose: () => {}
};

export default PopupRecommendSuccess;
