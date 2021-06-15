/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import './Popup.scss';
import PropTypes from 'prop-types';

function Popup({
  children,
  type,
  typeContainer,
  isOpen,
  onClose,
  withoutCloseButton,
  sectionClass
}) {
  const closeAllPopupsOnOverlay = (evt) => {
    if (evt.target === evt.currentTarget) {
      onClose();
    }
  };
  return (
    <div
      className={`popup popup_type_${type} ${isOpen ? 'popup_opened' : ''} `}
      onClick={closeAllPopupsOnOverlay}
    >
      <div className={`popup__container popup__container_type_${typeContainer} ${sectionClass}`}>
        {!withoutCloseButton
            && (
            <button
              className="popup__close"
              type="button"
              aria-label="закрыть попап"
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
  sectionClass: PropTypes.string
};

Popup.defaultProps = {
  children: null,
  type: '',
  typeContainer: '',
  isOpen: false,
  onClose: () => {},
  sectionClass: '',
  withoutCloseButton: false
};

export default Popup;
