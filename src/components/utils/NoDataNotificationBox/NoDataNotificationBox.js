import PropTypes from 'prop-types';
import './NoDataNotificationBox.scss';

function NoDataNotificationBox({ text, sectionClass }) {
  return <p className={`no-data-text ${sectionClass}`}>{text}</p>;
}

NoDataNotificationBox.propTypes = {
  text: PropTypes.string.isRequired,
  sectionClass: PropTypes.string,
};

NoDataNotificationBox.defaultProps = {
  sectionClass: '',
};

export default NoDataNotificationBox;
