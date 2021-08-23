import React, { useState } from 'react';
import './PopupVideo.scss';
import PropTypes from 'prop-types';
import Popup from '../Popup/Popup';
import { TitleH2, Caption } from '../../utils/index';
import parserLinkYoutube from '../../../utils/parser-link-youtube';
import Loader from '../../utils/Loader/Loader';
import {
  getLocalStorageData,
  removeLocalStorageData,
} from '../../../hooks/useLocalStorage';
import { localStChosenVideo } from '../../../config/constants';

const PopupVideo = ({ isOpen, onClose }) => {
  const data = getLocalStorageData(localStChosenVideo);
  const { frameSrc } = parserLinkYoutube(data?.link);

  const [iframeIsLoading, setIframeIsLoading] = useState(true);

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
      {iframeIsLoading && <Loader isNested />}
      <>
        <iframe
          title="youTubePlayer"
          id="playeryt"
          onLoad={() => setIframeIsLoading(false)}
          className="popup__video-iframe"
          src={frameSrc}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          seamless
        />
        <TitleH2 sectionClass="popup__video-title" title={data?.title} />
        <Caption sectionClass="popup__video-caption" title={data?.info} />
      </>
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
