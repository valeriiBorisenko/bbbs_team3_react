import PropTypes from 'prop-types';
import Popup from '../Popup/Popup';
import './PopupPhoto.scss';

function PopupPhoto({ isOpen, onClose, currentPhoto }) {
  return (
    <Popup isOpen={isOpen} onClose={onClose} type="photo" typeContainer="photo">
      <figure className="popup__photo-figure">
        <img
          className="popup__full-image"
          src={currentPhoto?.photoSrc}
          alt={currentPhoto?.caption}
        />
        <figcaption className="popup__full-caption">
          {currentPhoto?.caption}
        </figcaption>
      </figure>
    </Popup>
  );
}

PopupPhoto.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentPhoto: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default PopupPhoto;
