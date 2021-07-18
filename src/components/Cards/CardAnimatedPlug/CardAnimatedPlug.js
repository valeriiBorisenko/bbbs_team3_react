import { useEffect, useRef } from 'react';
import './CardAnimatedPlug.scss';
import PropTypes from 'prop-types';
import Lottie from 'lottie-web';
import animation from '../../../assets/animation/ill_popup_recommend-success.json';
import { Card } from '../../utils/index';

function CardAnimatedPlug({ text, sectionClass }) {
  const animationContainer = useRef(null);
  useEffect(() => {
    Lottie.loadAnimation({
      container: animationContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animation,
    });
  }, []);

  return (
    <Card sectionClass={sectionClass}>
      <div className="card-animatedbox">
        <div className="card-animatedbox__animation" ref={animationContainer} />
        <p className="paragraph card-animatedbox__text">{text}</p>
      </div>
    </Card>
  );
}

CardAnimatedPlug.propTypes = {
  text: PropTypes.string,
  sectionClass: PropTypes.string,
};

CardAnimatedPlug.defaultProps = {
  text: '',
  sectionClass: '',
};

export default CardAnimatedPlug;
