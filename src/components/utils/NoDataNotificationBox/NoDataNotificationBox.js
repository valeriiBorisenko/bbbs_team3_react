import PropTypes from 'prop-types';
import './NoDataNotificationBox.scss';
import texts from './locales/RU';

function NoDataNotificationBox({ text, sectionClass, isAnimated }) {
  const classNames = [
    'no-data-text',
    isAnimated ? 'no-data-text_animated' : '',
    sectionClass,
  ]
    .join(' ')
    .trim();
  return <p className={classNames}>{text}</p>;
}

NoDataNotificationBox.propTypes = {
  text: PropTypes.string,
  sectionClass: PropTypes.string,
  isAnimated: PropTypes.bool,
};

NoDataNotificationBox.defaultProps = {
  text: texts.defaultText,
  sectionClass: '',
  isAnimated: false,
};

export default NoDataNotificationBox;
