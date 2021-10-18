import PropTypes from 'prop-types';
import texts from './locales/RU';
import { refineClassNames } from '../../../utils/utils';
import './NoDataNotificationBox.scss';

function NoDataNotificationBox({ text, sectionClass, isAnimated }) {
  const classNames = {
    main: refineClassNames([
      'no-data-text',
      isAnimated ? 'no-data-text_animated' : '',
      sectionClass,
    ]),
  };

  return <p className={classNames.main}>{text}</p>;
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
