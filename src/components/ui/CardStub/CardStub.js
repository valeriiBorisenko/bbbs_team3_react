import './CardStub.scss';
import { Link } from 'react-router-dom';
import logoPath from '../../../assets/calendar_logo.svg';

function CardStub() {
  return (
    <article className="stub">
      <div className="stub__upper-element">
        <Link to="/" rel="noopener noreferrer">
          <img
            src={logoPath}
            alt="Логотип Старшие Братья Старшие Сестры России"
            className="stub__logo"
          />
        </Link>
      </div>
      <div className="stub__content">
        <h2 className="section-title stub__text">
          Наставники.про – цифровая информационная платформа огрганизации «Старшие Братья
          Старшие Сестры». Созданная для поддержки наставников программы.
        </h2>
      </div>
    </article>
  );
}

export default CardStub;
