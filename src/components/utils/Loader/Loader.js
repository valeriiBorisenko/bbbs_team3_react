import PropTypes from 'prop-types';
import { refineClassNames } from '../../../utils/utils';
import './Loader.scss';

function Loader({ isNested, isCentered, isSmallGrid, isPaginate }) {
  const classNames = {
    main: refineClassNames([
      'spinner',
      isNested ? 'spinner_nested' : '',
      isCentered ? 'spinner_centered' : '',
      isSmallGrid ? 'spinner_small-grid' : '',
      isPaginate ? 'spinner_paginate' : '',
    ]),
  };

  return (
    <div className={classNames.main}>
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
  isSmallGrid: PropTypes.bool,
  isPaginate: PropTypes.bool,
};

Loader.defaultProps = {
  isNested: false,
  isCentered: false,
  isSmallGrid: false,
  isPaginate: false,
};

export default Loader;
