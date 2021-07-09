import React, { useEffect, useState } from 'react';
import './PopupVideo.scss';
import PropTypes from 'prop-types';

import Popup from '../Popup/Popup';
import { TitleH2, Caption } from '../../utils/index';
import parserLinkYoutube from '../../../utils/parser-link-youtube';
import Loader from '../../utils/Loader/Loader';

const PopupVideo = ({ data, isOpen, onClose }) => {
  const { id, title, info, link } = data;

  const [videoSrc, setVideoSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Обнуляем юзстейт с ссылкой при закрытии
  const close = () => {
    onClose();
    setVideoSrc(null);
  };

  // без асинк/евейт мелькает предыдущее видео при открытии нового
  const getSrcFrame = async () => {
    const src = await parserLinkYoutube(link);
    setVideoSrc(src);

    // Искуственная задержка что бы увидеть лоадер
    setTimeout(() => {
      setIsLoading(false);
    }, 2 * 1000);
  };

  // При открытии нового попапас с видео
  // запускаем загруку и парсер
  useEffect(() => {
    setIsLoading(true);
    getSrcFrame();
  }, [id]);

  return (
    <Popup
      type="video"
      typeContainer="video"
      isOpen={isOpen}
      onClose={close}
      withoutCloseButton
    >
      {isLoading ? (
        <Loader isNested />
      ) : (
        <>
          <iframe
            title="youTubePlayer"
            id="playeryt"
            className="popup__video-iframe"
            src={`${videoSrc}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            seamless
          />

          <TitleH2 sectionClass="popup__video-title" title={title} />
          <Caption sectionClass="popup__video-caption" title={info} />
        </>
      )}
    </Popup>
  );
};

PopupVideo.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

PopupVideo.defaultProps = {
  data: {},
  isOpen: false,
  onClose: () => {},
};

export default PopupVideo;
