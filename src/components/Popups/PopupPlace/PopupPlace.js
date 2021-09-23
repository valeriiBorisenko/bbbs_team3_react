import React from 'react';
import PropTypes from 'prop-types';
import Popup from '../Popup/Popup';
import './PopupPlace.scss';

import { COLORS, localStChosenPlace } from '../../../config/constants';
import CardPlace from '../../Cards/CardPlace/CardPlace';
import { useActivityTypes } from '../../../hooks';
import {
  getLocalStorageData,
  removeLocalStorageData,
} from '../../../hooks/useLocalStorage';

const PopupPlace = ({ isOpen, onClose }) => {
  const activityTypes = useActivityTypes();
  const place = getLocalStorageData(localStChosenPlace) || {};

  const getRandomColor = (max) => Math.floor(Math.random() * max);

  const closePopup = () => {
    removeLocalStorageData(localStChosenPlace);
    onClose();
  };

  return (
    <Popup
      type="place"
      typeContainer="place"
      sectionClass="popup__container_place"
      isOpen={isOpen}
      onClose={closePopup}
      withoutCloseButton
    >
      <CardPlace
        data={place}
        activityTypes={activityTypes}
        color={COLORS[getRandomColor(COLORS.length)]}
        sectionClass="card-container_type_article scale-in"
      />
    </Popup>
  );
};

PopupPlace.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

PopupPlace.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

export default PopupPlace;
