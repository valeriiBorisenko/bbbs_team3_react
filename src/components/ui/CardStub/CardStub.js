import LogoBlue from '../LogoBlue/LogoBlue';
import './CardStub.scss';

function CardStub() {
  return (
    <article className="stub">
      <div className="stub__upper-element">
        <LogoBlue sectionClass="stub__logo" />
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
