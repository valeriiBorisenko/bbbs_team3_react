import React, { useEffect, useState } from 'react';
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
  console.log('PopupVideo COMPONENT');

  //! если убирать лоадер вообще, то можно оставить embedSrc и загрузку даты из стораджа
  // даже не понадобится еффекты и стейты
  const data = getLocalStorageData(localStChosenVideo);
  // const embedSrc = parserLinkYoutube(data?.link);

  // const [data, setData] = useState(null);
  // setData(getLocalStorageData(localStChosenVideo))
  console.log('data', data);
  // const { id, title, info, link } = data;

  // const [videoSrc, setVideoSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // без асинк/евейт мелькает предыдущее видео при открытии нового
  const getSrcFrame = () => {
    const src = parserLinkYoutube(data?.link);
    // setVideoSrc(src);

    // Искуственная задержка что бы увидеть лоадер
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return src;
  };

  const onCloseHandler = () => {
    // setVideoSrc(null);
    // setData(null);
    removeLocalStorageData(localStChosenVideo);
    onClose();
  };

  // При открытии нового попапа с видео
  // запускаем загруку и парсер

  useEffect(() => {
    console.log('ПОПАП ВИДЕО ЮЗЕФФЕКТ');
    if (isOpen) {
      setIsLoading(true);
      // setData(getLocalStorageData(localStChosenVideo));
      // getSrcFrame();
    }
  }, [isOpen]);

  useEffect(() => {
    console.log('USE EFFECT 2');
    setIsLoading(false);
  }, []);

  function renderPopup() {
    console.log('renderPopup FUNC');
    if (isLoading) {
      console.log('isLoading IF');
      return <Loader isNested />;
    }

    // console.log(isLoading);
    console.log(data);
    // console.log(videoSrc);

    if (data) {
      console.log('data && videoSrc IF ');
      return (
        <>
          <iframe
            title="youTubePlayer"
            id="playeryt"
            className="popup__video-iframe"
            // src={videoSrc}
            src={getSrcFrame()}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            seamless
          />
          <TitleH2 sectionClass="popup__video-title" title={data?.title} />
          <Caption sectionClass="popup__video-caption" title={data?.info} />
        </>
      );
    }

    return null;
  }

  return (
    <Popup
      type="video"
      typeContainer="video"
      isOpen={isOpen}
      onClose={onCloseHandler}
      withoutCloseButton
    >
      {/* <iframe
        title="youTubePlayer"
        id="playeryt"
        className="popup__video-iframe"
        src={embedSrc}
        // src={getSrcFrame()}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        seamless
      />
      <TitleH2 sectionClass="popup__video-title" title={data?.title} />
      <Caption sectionClass="popup__video-caption" title={data?.info} /> */}

      {renderPopup()}
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
