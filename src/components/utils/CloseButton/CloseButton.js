import './CloseButton.scss';
import PropTypes from 'prop-types';
import texts from './locales/RU';
import { COLOR_BLUE } from '../../../config/constants';
import { refineClassNames } from '../../../utils/utils';

function CloseButton({ onClick, sectionClass }) {
  const classNames = {
    main: refineClassNames(['close-button', sectionClass]),
  };

  return (
    <button
      className={classNames.main}
      type="button"
      aria-label={texts.ariaLabel}
      onClick={onClick}
    >
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.29017 10.0002L0.000537447 19.2303L0.645681 19.8713L9.93531 10.6412L19.3543 19.9999L19.9995 19.3589L10.5805 10.0002L20 0.641011L19.3549 0L9.93531 9.3592L0.645144 0.128548L0 0.769559L9.29017 10.0002Z"
          fill={COLOR_BLUE}
        />
      </svg>
    </button>
  );
}

CloseButton.propTypes = {
  onClick: PropTypes.func,
  sectionClass: PropTypes.string,
};

CloseButton.defaultProps = {
  onClick: undefined,
  sectionClass: '',
};

export default CloseButton;
