import './Logo.scss';
import PropTypes from 'prop-types';
import texts from './locales/RU';
import blueLogo from '../../../assets/logo.svg';
import whiteLogo from '../../../assets/footer-logo.svg';

function Logo({ isWhite, sectionClass }) {
  const classNames = ['logo', sectionClass].join(' ').trim();

  return (
    <img
      src={isWhite ? whiteLogo : blueLogo}
      alt={texts.altText}
      className={classNames}
    />
  );
}

Logo.propTypes = {
  isWhite: PropTypes.bool,
  sectionClass: PropTypes.string,
};

Logo.defaultProps = {
  isWhite: false,
  sectionClass: '',
};

export default Logo;
