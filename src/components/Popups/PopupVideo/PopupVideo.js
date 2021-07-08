/* eslint-disable no-unused-vars */
import React from 'react';
import './PopupVideo.scss';
import PropTypes from 'prop-types';

import Popup from '../Popup/Popup';
import { TitleH2, Caption } from '../../utils/index';

function parserLinkYoutube(link) {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = link.match(regExp);
  return match && match[7].length === 11 ? match[7] : false;
}

function getUrlThumbnail(link) {
  const id = parserLinkYoutube(link);
  const imagePreview = `http://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  return imagePreview;
}

const PopupVideo = ({ data, isOpen, onClose }) => {
  const { title, info, link } = data;
  return (
    <Popup
      type="video"
      typeContainer="video"
      isOpen={isOpen}
      onClose={onClose}
      withoutCloseButton
    >
      <iframe
        title={title}
        className="popup__video-iframe"
        src="https://www.youtube.com/embed/U4QCyP_klLk"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />

      <TitleH2 sectionClass="popup__video-title" title={title} />
      <Caption sectionClass="popup__video-caption" title={info} />
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
