/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import './Popup.scss';
import '../PopupAboutEvent/PopupAboutEvent.scss';
import PropTypes from 'prop-types';

// наверное стоит переименовать данный Popup в
// PopupwithForm, а для "безформенных" попапов сделать отдельный компонент
function Popup({
  children,
  type,
  typeContainer,
  isOpen,
  onClose,
  withoutCloseButton,
  onSubmit,
  sectionClass
}) {
  const closeAllPopupsOnOverlay = (evt) => {
    if (evt.target === evt.currentTarget) {
      onClose();
    }
  };
  return (
    <div className={`popup popup_type_${type} ${isOpen ? 'popup_opened' : ''} `} onClick={closeAllPopupsOnOverlay}>
      <div className={`popup__container popup__container_type_${typeContainer} ${sectionClass}`}>
        <form className="popup__form" onSubmit={onSubmit}>
          {!withoutCloseButton && <button className="popup__close" type="button" aria-label="закрыть попап" onClick={onClose} />}
          {children}
        </form>
      </div>
    </div>
  );
}

Popup.propTypes = {
  children: PropTypes.element.isRequired,
  type: PropTypes.string,
  typeContainer: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  withoutCloseButton: PropTypes.bool,
  onSubmit: PropTypes.func,
  sectionClass: PropTypes.string
};

Popup.defaultProps = {
  type: '',
  typeContainer: '',
  isOpen: false,
  onClose: undefined,
  sectionClass: '',
  withoutCloseButton: false,
  onSubmit: undefined
};

export default Popup;
