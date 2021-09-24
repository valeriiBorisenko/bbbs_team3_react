import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Lottie from 'lottie-web';
import animation from '../../../assets/animation/ill_popup_recommend-success.json';
import { Card } from '../../utils';
import './CardAnimatedPlug.scss';

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
