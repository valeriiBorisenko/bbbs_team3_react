import React from 'react';
import PropTypes from 'prop-types';
import Popup from '../Popup/Popup';
import CardBook from '../../Cards/CardBook/CardBook';
import {
  getLocalStorageData,
  removeLocalStorageData,
} from '../../../hooks/useLocalStorage';
import { localStChosenBook } from '../../../config/constants';
import './PopupBook.scss';

const PopupBook = ({ isOpen, onClose }) => {
  const book = getLocalStorageData(localStChosenBook) || {};

  const closePopup = () => {
    removeLocalStorageData(localStChosenBook);
    onClose();
  };
  return (
    <Popup
      type="book"
      typeContainer="book"
      sectionClass="popup__container_book"
      isOpen={isOpen}
      onClose={closePopup}
      withoutCloseButton
    >
      <CardBook data={book} />
    </Popup>
  );
};

PopupBook.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

PopupBook.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

export default PopupBook;
