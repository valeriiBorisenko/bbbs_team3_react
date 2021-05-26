import PropTypes from 'prop-types';
import TitleH1 from '../ui/TitleH1/TitleH1';
import ButtonTags from '../ui/Button/ButtonTags';
import './Calendar.scss';
import CardCalendar from '../ui/CardCalendar/CardCalendar';
import MonthData from '../../utils/constants';

function Calendar({
  onClick,
  clickButton,
  isSelected,
  dataCalendar
}) {
  return dataCalendar ? (
    <section className="lead page__section">
      <TitleH1 title="Календарь" />
      <div className="tags">
        <ul className="tags__list">
          {MonthData.map((data) => (
            <li className="tags__list-item" key={data.id}>
              <ButtonTags title={data.name} color="black" />
            </li>
          ))}
        </ul>
      </div>
      <section className="calendar-container">
        { dataCalendar.events.map((data) => (
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
  ) : (
    <p style={{ color: 'red', margin: '0 auto', textAlign: 'center' }}>Loading</p>
  );
}

Calendar.propTypes = {
  onClick: PropTypes.func,
  clickButton: PropTypes.func,
  isSelected: PropTypes.bool,
  dataCalendar: PropTypes.objectOf(PropTypes.any)
};

Calendar.defaultProps = {
  onClick: undefined,
  clickButton: undefined,
  isSelected: false,
  dataCalendar: {}
};

export default Calendar;
