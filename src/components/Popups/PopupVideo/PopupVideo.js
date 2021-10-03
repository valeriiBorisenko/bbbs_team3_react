import PropTypes from 'prop-types';
import Popup from '../Popup/Popup';
import { Caption, TitleH2 } from '../../utils/index';
import parserLinkYoutube from '../../../utils/parser-link-youtube';
import {
  getLocalStorageData,
  removeLocalStorageData,
} from '../../../hooks/useLocalStorage';
import { localStChosenVideo } from '../../../config/constants';
import './PopupVideo.scss';
import { staticImageUrl } from '../../../config/config';

const PopupVideo = ({ isOpen, onClose }) => {
  const data = getLocalStorageData(localStChosenVideo);
  const { frameSrc } = parserLinkYoutube(data?.link);

  const closePopup = () => {
    removeLocalStorageData(localStChosenVideo);
    onClose();
  };

  return (
    <Popup
      type="video"
      typeContainer="video"
      isOpen={isOpen}
      onClose={closePopup}
    >
      <div className="popup__video-iframe-container">
        {data?.image && (
          <img
            className="popup__video-preview"
            src={`${staticImageUrl}/${data.image}`}
            alt={data.title}
          />
        )}
        {isOpen && (
          <iframe
            title={data?.title}
            id="playeryt"
            className="popup__video-iframe"
            src={`${frameSrc}?autoplay=1`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            seamless
          />
        )}
      </div>
      <TitleH2 sectionClass="popup__video-title" title={data?.title} />
      <Caption sectionClass="popup__video-caption" title={data?.info} />
    </Popup>
  );
};

PopupVideo.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

PopupVideo.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

export default PopupVideo;
