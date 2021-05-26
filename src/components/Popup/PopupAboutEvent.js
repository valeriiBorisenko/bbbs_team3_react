import './Popup.scss';
import PropTypes from 'prop-types';
import Popup from './Popup';
import Button from '../ui/Button/Button';
import TitleH2 from '../ui/TitleH2/TitleH2';

function PopupAboutEvent({ isOpen, onClose, onOpenConfirmationPopup }) {
  function submitHandler(event) {
    event.preventDefault();
    onOpenConfirmationPopup();
  }
  return (
    <Popup
      type="calendar"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="calendar__caption">
        <div className="calendar__info">
          {/* заменить на пропс */}
          <p className="calendar__type">Волонтёры + дети</p>
          {/* заменить на пропс */}
          <p className="calendar__weekday">Декабрь / понедельник</p>
        </div>
        <div className="calendar__about">
          {/* заменить на пропс */}
          <TitleH2
            title="Занятие с выпускниками: как составить резюме"
            sectionClass="calendar__title calendar__title_type_popup"
          />
          {/* заменить на пропс */}
          <p className="calendar__date">20</p>
        </div>
      </div>
      <div className="calendar__meetup">
        <ul className="calendar__info-list">
          <li className="calendar__info-item">
            {/* заменить на пропс */}
            <p className="calendar__time">12:00–14:00</p>
          </li>
          <li className="calendar__info-item">
            {/* заменить на пропс */}
            <p className="calendar__place">Садовническая наб., д. 77 стр. 1 (офис компании Ernst&Young)</p>
          </li>
          <li className="calendar__info-item">
            {/* заменить на пропс */}
            <p className="calendar__contact">Александра, +7 926 356-78-90</p>
          </li>
        </ul>
        <div className="calendar__description">
          {/* заменить на пропс */}
          <p className="paragraph calendar__desc-paragraph">Наконец-то наступила весна и мы пережили эту долгую зиму! И возможно, что внутренних сил и ресурса сейчас не так много, а до окончания учебного года ещё целых несколько месяцев. Поэтому приглашаем вас на встречу нашего ресурсного клуба &quot;Наставник PRO&quot;, которую мы хотим посвятить теме поиска моральных сил, смыслов и внутреннего ресурса для общения и взаимодействия с нашими подопечными.</p>
        </div>
        <div className="calendar__submit">
          <Button
            color="blue"
            title="Записаться"
            sectionClass="button_action_confirm"
            onClick={submitHandler}
            isSubmittable
          />
          {/* заменить на пропс или считать тут же */}
          <p className="calendar__place-left">Осталось 5 мест</p>
        </div>
      </div>
    </Popup>
  );
}

PopupAboutEvent.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onOpenConfirmationPopup: PropTypes.func
};

PopupAboutEvent.defaultProps = {
  isOpen: false,
  onClose: undefined,
  onOpenConfirmationPopup: undefined
};

export default PopupAboutEvent;
