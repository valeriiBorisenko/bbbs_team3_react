import './PopupDeleteDiary.scss';
import PropTypes from 'prop-types';
import {
  formatDate, Popup, TitleH2, Button
} from './index';

function PopupDeleteDiary({
  isOpen, onClose, onCardDelete, cardData
}) {
  const { title, date } = cardData;
  const day = formatDate(date);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onCardDelete(cardData);
  };

  return (
    <Popup
      type="confirm-delete-diary"
      typeContainer="confirm-diary"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      withoutCloseButton
      sectionClass="popup-diary"
    >
      <TitleH2
        title={`Удалить встречу в ${title} ${parseInt(day.day, 10)} ${day.monthName} ${day.year}?`}
        sectionClass="popup-diary__title"
      />
      <div className="popup-diary__buttons">
        <Button
          color="gray"
          sectionClass="popup-diary__button"
          title="Удалить"
          isSubmittable
        />
        <Button
          color="black"
          sectionClass="popup-diary__button"
          title="Отмена"
          onClick={onClose}
        />
      </div>
    </Popup>
  );
}

PopupDeleteDiary.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onCardDelete: PropTypes.func,
  cardData: PropTypes.objectOf(PropTypes.any)
};

PopupDeleteDiary.defaultProps = {
  isOpen: false,
  onClose: () => {},
  onCardDelete: () => {},
  cardData: {}
};

export default PopupDeleteDiary;
