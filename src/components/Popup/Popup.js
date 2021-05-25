import './Popup.scss';
import PropTypes from 'prop-types';

function Popup({
  children,
  type,
  isOpen,
  onClose
}) {
  return (
    <div className={`popup popup_type_${type} ${isOpen ? 'popup_opened' : ''}`}>
      <form className={`popup__container popup__container_type_${type}`}>
        <button className="popup__close" type="button" aria-label="закрыть" onClick={onClose} />
        {children}
      </form>
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
