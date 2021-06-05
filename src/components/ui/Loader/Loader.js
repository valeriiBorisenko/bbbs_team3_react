import './Loader.scss';
import PropTypes from 'prop-types';

function Loader({ sectionClass }) {
  const classNames = ['spinner', sectionClass].join(' ').trim();

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
  sectionClass: PropTypes.string
};

Loader.defaultProps = {
  sectionClass: ''
};

export default Loader;
