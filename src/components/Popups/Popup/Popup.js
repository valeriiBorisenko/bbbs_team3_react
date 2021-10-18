import PropTypes from 'prop-types';
import { refineClassNames } from '../../../utils/utils';
import { CloseButton } from '../../utils';
import './Popup.scss';

function Popup({
  children,
  type,
  typeContainer,
  isOpen,
  onClose,
  withoutCloseButton,
  sectionClass,
}) {
  const closePopupOnOverlay = (evt) => {
    if (evt.target === evt.currentTarget) {
      onClose();
    }
  };

  const classNames = {
    main: refineClassNames([
      'popup',
      `popup_type_${type}`,
      isOpen ? 'popup_opened' : '',
    ]),
    popupContainer: refineClassNames([
      'popup__container',
      `popup__container_type_${typeContainer}`,
      sectionClass,
    ]),
    closeButton: refineClassNames([
      'popup__close',
      `popup__close_type_${typeContainer}`,
    ]),
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div className={classNames.main} onClick={closePopupOnOverlay}>
      <div className={classNames.popupContainer}>
        {!withoutCloseButton && (
          <CloseButton
            sectionClass={classNames.closeButton}
            onClick={onClose}
          />
        )}
        {children}
      </div>
    </div>
  );
}

Popup.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string,
  typeContainer: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  withoutCloseButton: PropTypes.bool,
  sectionClass: PropTypes.string,
};

Popup.defaultProps = {
  children: null,
  type: '',
  typeContainer: '',
  isOpen: false,
  onClose: undefined,
  sectionClass: '',
  withoutCloseButton: false,
};

export default Popup;
