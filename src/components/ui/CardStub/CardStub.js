import LogoBlue from '../LogoBlue/LogoBlue';
import './CardStub.scss';

function CardStub() {
  return (
    <article className="stub">
      <div className="stub__upper-element">
        <a
          className="stub__logo"
          href="https://www.nastavniki.org/o-nas/ob-organizaczii/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LogoBlue />
        </a>
      </div>
      <div className="stub__content">
        <h2 className="section-title stub__text">
          Наставники.про – цифровая информационная платформа организации
          «Старшие Братья Старшие Сестры». Созданная для поддержки наставников
          программы.
        </h2>
      </div>
    </article>
  );
}

export default CardStub;
