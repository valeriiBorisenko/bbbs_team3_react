import './CardStub.scss';
import { Card, LogoBlue, TitleH2 } from './index';

function CardStub() {
  return (
    <Card sectionClass="stub" color="green">
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
        <TitleH2
          sectionClass="stub__text"
          title="Наставники.про – цифровая информационная платформа организации «Старшие Братья Старшие Сестры». Созданная для поддержки наставников программы."
        />
      </div>
    </Card>
  );
}

export default CardStub;
