import TitleH1 from '../ui/TitleH1/TitleH1';
import Button from '../ui/Button/Button';
import './Calendar.scss';
import CardCalendar from '../ui/CardCalendar/CardCalendar';
import { CalendarePageData, MounthData } from '../../utils/constants';

function Calendar() {
  return (
    <section className="lead page__section">
      <TitleH1 title="Календарь" />
      <div className="tags">
        <ul className="tags__list">
          {MounthData.mounth.map((data) => (
            <li className="tags__list-item">
              <Button title={data.name} color="black" />
            </li>
          ))}
        </ul>
      </div>
      <section className="calendar-container">
        { CalendarePageData.event.map((data) => (
          <CardCalendar
            key={data.id}
            tags={data.tags}
            startAt={data.startAt}
            endAt={data.endAt}
            title={data.title}
            address={data.address}
            contact={data.contact}
            remainSeats={data.remainSeats}
            description={data.description}
          />
        ))}
      </section>
    </section>
  );
}

export default Calendar;
