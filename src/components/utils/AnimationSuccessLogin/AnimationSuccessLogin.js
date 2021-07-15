import Lottie from 'lottie-web';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import animationSuccess from '../../../assets/animation/ill_popup_success.json';
import TitleH2 from '../TitleH2/TitleH2';
import texts from './locales/RU';
import './AnimationSuccessLogin.scss';

function AnimationSuccessLogin({ isSuccess }) {
  const animationContainer = useRef(null);
  const [cnahgeClass, setChangeClass] = useState(false);

  useEffect(() => {
    Lottie.loadAnimation({
      container: animationContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationSuccess,
    });
  }, []);

  const className = [
    'container-success',
    `${cnahgeClass ? 'container-success_hide' : ''}`,
  ]
    .join(' ')
    .trim();

  function timeForChangeClass() {
    setChangeClass(true);
  }

  useEffect(() => {
    if (isSuccess) {
      setTimeout(timeForChangeClass, 4500);
    }
  }, [isSuccess]);

  return (
    <div className={className}>
      <div ref={animationContainer} className="container-success__animation" />
      <TitleH2 title={texts.successTitle} />
    </div>
  );
}

AnimationSuccessLogin.propTypes = {
  isSuccess: PropTypes.bool,
};

AnimationSuccessLogin.defaultProps = {
  isSuccess: false,
};

export default AnimationSuccessLogin;
