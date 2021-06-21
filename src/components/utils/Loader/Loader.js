import './Loader.scss';
import PropTypes from 'prop-types';

function Loader({ isNested, isCentered }) {
  const classNames = [
    'spinner',
    isNested ? 'spinner_waiting-for-data' : '',
    isCentered ? 'spinner_centered' : '',
  ]
    .join(' ')
    .trim();

  return (
    <div className={classNames}>
      <div className="spinner__container">
        <div className="spinner__circle spinner__circle_1" />
        <div className="spinner__circle spinner__circle_2" />
        <div className="spinner__circle spinner__circle_3" />
        <div className="spinner__circle spinner__circle_4" />
        <div className="spinner__circle spinner__circle_5" />
        <div className="spinner__circle spinner__circle_6" />
        <div className="spinner__circle spinner__circle_7" />
        <div className="spinner__circle spinner__circle_8" />
        <div className="spinner__circle spinner__circle_9" />
        <div className="spinner__circle spinner__circle_10" />
        <div className="spinner__circle spinner__circle_11" />
        <div className="spinner__circle spinner__circle_12" />
      </div>
    </div>
  );
}

Loader.propTypes = {
  isNested: PropTypes.bool,
  isCentered: PropTypes.bool,
};

Loader.defaultProps = {
  isNested: false,
  isCentered: false,
};

export default Loader;
