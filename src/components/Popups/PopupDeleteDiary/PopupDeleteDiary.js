import './PopupDeleteDiary.scss';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import texts from './locales/RU';
import { formatDate, formatMonthsGenitiveCase } from '../../../utils/utils';
import Popup from '../Popup/Popup';
import { TitleH2, Button } from '../../utils/index';

function PopupDeleteDiary({ isOpen, onClose, onCardDelete, cardData }) {
  const { place, date } = cardData;
  const day = formatDate(date);
  const [month, setMonth] = useState(null);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onCardDelete(cardData);
  };

  useEffect(() => {
    if (isOpen) {
      setMonth(formatMonthsGenitiveCase(day?.monthName));
    }
  }, [isOpen]);

  return (
    <Popup
      type="confirm-delete-diary"
      typeContainer="confirm-diary"
      isOpen={isOpen}
      onClose={onClose}
      withoutCloseButton
      sectionClass="popup-diary"
    >
      <form className="popup__form" onSubmit={handleSubmit}>
        <TitleH2
          title={`${texts.title} ${place} ${parseInt(day.day, 10)} ${month} ${
            day.year
          }?`}
          sectionClass="popup-diary__title"
        />
        <div className="popup-diary__buttons">
          <Button
            color="gray"
            sectionClass="popup-diary__button"
            title={texts.submitButtonText}
            isSubmittable
          />
          <Button
            color="black"
            sectionClass="popup-diary__button"
            title={texts.cancelButtonText}
            onClick={onClose}
          />
        </div>
      </form>
    </Popup>
  );
}

PopupDeleteDiary.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onCardDelete: PropTypes.func,
  cardData: PropTypes.objectOf(PropTypes.any),
};

PopupDeleteDiary.defaultProps = {
  isOpen: false,
  onClose: () => {},
  onCardDelete: () => {},
  cardData: {},
};

export default PopupDeleteDiary;
