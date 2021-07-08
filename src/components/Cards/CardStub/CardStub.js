import './CardStub.scss';
import texts from './locales/RU';
import { Card, LogoBlue, TitleH2 } from '../../utils/index';

function CardStub() {
  return (
    <Card sectionClass="stub" color="green">
      <div className="stub__upper-element">
        <a
          className="stub__logo"
          href={texts.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <LogoBlue />
        </a>
      </div>
      <div className="stub__content">
        <TitleH2 sectionClass="stub__text" title={texts.title} />
      </div>
    </Card>
  );
}

export default CardStub;
