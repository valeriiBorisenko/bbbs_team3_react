/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import './Popup.scss';
import PropTypes from 'prop-types';

// наверное стоит переименовать данный Popup в
// PopupwithForm, а для "безформенных" попапов сделать отдельный компонент
function Popup({
  children,
  type,
  isOpen,
  onClose
}) {
  const closeAllPopupsOnOverlay = (evt) => {
    if (evt.target === evt.currentTarget) {
      onClose();
    }
  };
  return (
    <div className={`popup popup_type_${type} ${isOpen ? 'popup_opened' : ''}`} onClick={closeAllPopupsOnOverlay}>
      <div className={`popup__container popup__container_type_${type}`}>
        <form className="popup__form">
          <button className="popup__close" type="button" aria-label="закрыть попап" onClick={onClose} />
          {children}
        </form>
      </div>
    </div>
  );
}

Popup.propTypes = {
  children: PropTypes.element.isRequired,
  type: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

Popup.defaultProps = {
  type: '',
  isOpen: false,
  onClose: undefined
};

export default Popup;
