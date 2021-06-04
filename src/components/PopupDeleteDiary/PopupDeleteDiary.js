import './PopupDeleteDiary.scss';
import PropTypes from 'prop-types';
import { formatDate } from '../../utils/utils';
import Popup from '../Popup/Popup';
import TitleH2 from '../ui/TitleH2/TitleH2';
import Button from '../ui/Button/Button';

function PopupDeleteDiary({ isOpen, onClose, data: { title, date } }) {
  const day = formatDate(date);
  return (
    <Popup
      type="confirm-delete-diary"
      typeContainer="confirm-diary"
      isOpen={isOpen}
      onClose={onClose}
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
  data: PropTypes.objectOf(PropTypes.any)
};

PopupDeleteDiary.defaultProps = {
  isOpen: false,
  onClose: undefined,
  data: {}
};

export default PopupDeleteDiary;
