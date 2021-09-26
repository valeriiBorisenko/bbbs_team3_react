import React from 'react';
import PropTypes from 'prop-types';
import { useCloseOnEscape } from '../../../hooks';
import Popup from '../Popup/Popup';
import CardBook from '../../Cards/CardBook/CardBook';
import './PopupBook.scss';

const PopupBook = ({ isOpen, onClose, book }) => {
  useCloseOnEscape(isOpen, onClose);

  return (
    <Popup
      type="book"
      typeContainer="book"
      sectionClass="popup__container_book"
      isOpen={isOpen}
      onClose={onClose}
      withoutCloseButton
    >
      <CardBook data={book} />
    </Popup>
  );
};

PopupBook.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  book: PropTypes.objectOf(PropTypes.any).isRequired,
};

PopupBook.defaultProps = {
  isOpen: false,
  onClose: () => {},
};

export default PopupBook;
