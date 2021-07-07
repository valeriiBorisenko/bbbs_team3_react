import './AnimatedPageContainer.scss';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-web';
import texts from './locales/RU';
import animation404 from '../../assets/animation/Illustration_404.json';
import { TitleH2 } from '../utils/index';

function AnimatedPageContainer({ is404, titleText, buttonText }) {
  const animationContainer = useRef();

  useEffect(() => {
    Lottie.loadAnimation({
      container: animationContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animation404,
    });
  }, []);

  return (
    <div className="animated-section">
      <div ref={animationContainer} className="animated-section__animation" />
      {is404 && <h1 className="page-not-found-title">{texts.title404}</h1>}
      <TitleH2 title={titleText} sectionClass="animated-section__subtitle" />
      <Link className="button animated-section__link button_color_blue" to="/">
        {buttonText}
      </Link>
    </div>
  );
}

AnimatedPageContainer.propTypes = {
  is404: PropTypes.bool,
  titleText: PropTypes.string,
  buttonText: PropTypes.string,
};

AnimatedPageContainer.defaultProps = {
  is404: false,
  titleText: '',
  buttonText: texts.buttonText,
};

export default AnimatedPageContainer;
