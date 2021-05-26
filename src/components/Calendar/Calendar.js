import PropTypes from 'prop-types';
import TitleH1 from '../ui/TitleH1/TitleH1';
import ButtonTags from '../ui/Button/ButtonTags';
import './Calendar.scss';
import CardCalendar from '../ui/CardCalendar/CardCalendar';
import { CalendarePageData, MounthData } from '../../utils/constants';

function Calendar({ onClick, clickButton, isSelected }) {
  return (
    <section className="lead page__section">
      <TitleH1 title="Календарь" />
      <div className="tags">
        <ul className="tags__list">
          {MounthData.mounth.map((data) => (
            <li className="tags__list-item" key={data.id}>
              <ButtonTags title={data.name} color="black" />
            </li>
          ))}
        </ul>
      </div>
      <section className="calendar-container">
        { CalendarePageData.event.map((data) => (
          <CardCalendar
            key={data.id}
            data={data}
            onClick={onClick}
            clickButton={clickButton}
            isSelected={isSelected}
          />
        ))}
      </section>
    </section>
  );
}

Calendar.propTypes = {
  onClick: PropTypes.func,
  clickButton: PropTypes.func,
  isSelected: PropTypes.bool
};

Calendar.defaultProps = {
  onClick: undefined,
  clickButton: undefined,
  isSelected: false
};

export default Calendar;
