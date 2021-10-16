import PropTypes from 'prop-types';
import texts from './locales/RU';
import { useCloseOnEscape } from '../../../hooks';
import { formatDate, formatMonthsGenitiveCase } from '../../../utils/utils';
import Popup from '../Popup/Popup';
import { Button, Heading } from '../../utils';
import './PopupDeleteDiary.scss';

function PopupDeleteDiary({
  isOpen,
  onClose,
  onCardDelete,
  cardData,
  isWaitingResponse,
}) {
  useCloseOnEscape(isOpen, onClose);

  const { place, date } = cardData;
  const day = formatDate(date);
  const month = formatMonthsGenitiveCase(day?.monthName);

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
      withoutCloseButton
      sectionClass="popup-diary"
    >
      <form className="popup__form" onSubmit={handleSubmit}>
        <Heading
          level={2}
          type="small"
          content={`${texts.title} ${place} ${parseInt(day.day, 10)} ${month} ${
            day.year
          }?`}
          sectionClass="popup-diary__title"
        />
        <div className="popup-diary__buttons">
          <Button
            color="gray"
            sectionClass="popup-diary__button"
            title={
              isWaitingResponse
                ? texts.loadingButtonText
                : texts.submitButtonText
            }
            isDisabled={isWaitingResponse}
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
  isWaitingResponse: PropTypes.bool,
};

PopupDeleteDiary.defaultProps = {
  isOpen: false,
  onClose: () => {},
  onCardDelete: () => {},
  cardData: {},
  isWaitingResponse: false,
};

export default PopupDeleteDiary;
