import './CardStub.scss';
import logoPath from '../../../assets/calendar_logo.svg';

function CardStub() {
  return (
    <article className="stub">
      <div className="stub__upper-element">
        <a href="./index.html" rel="noopener noreferrer">
          <img
            src={logoPath}
            alt="Логотип Старшие Братья Старшие Сестры России"
            className="stub__logo"
          />
        </a>
      </div>
      <div className="stub__content">
        <h2 className="stub__text">
          Наставники.про – цифровая информационная платформа огрганизации «Старшие Братья
          Старшие Сестры». Созданная для поддержки наставников программы.
        </h2>
      </div>
    </article>
  );
}

export default CardStub;
