import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-web';
import { animation404, TitleH2 } from './index';

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
      {is404 && <h1 className="page-not-found-title">404</h1>}
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
  buttonText: 'Вернуться на главную',
};

export default AnimatedPageContainer;
