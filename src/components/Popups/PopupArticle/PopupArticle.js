import React from 'react';
import PropTypes from 'prop-types';
import { useCloseOnEscape } from '../../../hooks';
import Popup from '../Popup/Popup';
import { COLORS } from '../../../config/constants';
import CardArticle from '../../Cards/CardArticle/CardArticle';
import './PopupArticle.scss';

const PopupArticle = ({ isOpen, onClose, article }) => {
  const getRandomColor = (max) => Math.floor(Math.random() * max);

  useCloseOnEscape(isOpen, onClose);

  return (
    <Popup
      type="article"
      typeContainer="article"
      sectionClass="popup__container_article"
      isOpen={isOpen}
      onClose={onClose}
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
  article: PropTypes.objectOf(PropTypes.any).isRequired,
};

PopupArticle.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

export default PopupArticle;
