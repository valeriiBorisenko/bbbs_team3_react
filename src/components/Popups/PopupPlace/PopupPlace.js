import React from 'react';
import PropTypes from 'prop-types';
import { useCloseOnEscape } from '../../../hooks';
import { COLORS } from '../../../config/constants';
import Popup from '../Popup/Popup';
import CardPlace from '../../Cards/CardPlace/CardPlace';
import './PopupPlace.scss';

const PopupPlace = ({ isOpen, onClose, place, activityTypesSimplified }) => {
  const getRandomColor = (max) => Math.floor(Math.random() * max);

  useCloseOnEscape(isOpen, onClose);

  return (
    <Popup
      type="place"
      typeContainer="place"
      sectionClass="popup__container_place"
      isOpen={isOpen}
      onClose={onClose}
      withoutCloseButton
    >
      <CardPlace
        data={place}
        activityTypesSimplified={activityTypesSimplified}
        color={COLORS[getRandomColor(COLORS.length)]}
        sectionClass="card-container_type_article scale-in"
      />
    </Popup>
  );
};

PopupPlace.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  place: PropTypes.objectOf(PropTypes.any).isRequired,
  activityTypesSimplified: PropTypes.objectOf(PropTypes.any).isRequired,
};

PopupPlace.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

export default PopupPlace;
