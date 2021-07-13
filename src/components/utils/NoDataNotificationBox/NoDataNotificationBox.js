import PropTypes from 'prop-types';
import './NoDataNotificationBox.scss';
import texts from './locales/RU';

function NoDataNotificationBox({ text, sectionClass }) {
  return <p className={`no-data-text ${sectionClass}`}>{text}</p>;
}

NoDataNotificationBox.propTypes = {
  text: PropTypes.string,
  sectionClass: PropTypes.string,
};

NoDataNotificationBox.defaultProps = {
  text: texts.defaultText,
  sectionClass: '',
};

export default NoDataNotificationBox;
