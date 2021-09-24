import React from 'react';
import PropTypes from 'prop-types';
import Popup from '../Popup/Popup';
import { COLORS, localStChosenArticle } from '../../../config/constants';
import {
  getLocalStorageData,
  removeLocalStorageData,
} from '../../../hooks/useLocalStorage';
import CardArticle from '../../Cards/CardArticle/CardArticle';
import './PopupArticle.scss';

const PopupArticle = ({ isOpen, onClose }) => {
  const article = getLocalStorageData(localStChosenArticle) || {};

  const getRandomColor = (max) => Math.floor(Math.random() * max);

  const closePopup = () => {
    removeLocalStorageData(localStChosenArticle);
    onClose();
  };

  return (
    <Popup
      type="article"
      typeContainer="article"
      sectionClass="popup__container_article"
      isOpen={isOpen}
      onClose={closePopup}
      withoutCloseButton
    >
      <CardArticle
        color={COLORS[getRandomColor(COLORS.length)]}
        data={article}
        sectionClass="scale-in"
      />
    </Popup>
  );
};

PopupArticle.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

PopupArticle.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

export default PopupArticle;
