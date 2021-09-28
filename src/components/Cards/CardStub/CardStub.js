import PropTypes from 'prop-types';
import texts from './locales/RU';
import { Card, Logo, TitleH2 } from '../../utils';
import './CardStub.scss';

function CardStub({ sectionClass }) {
  return (
    <Card sectionClass={`stub ${sectionClass}`} color="green">
      <div className="stub__upper-element">
        <a
          className="stub__logo"
          href={texts.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Logo />
        </a>
      </div>
      <div className="stub__content">
        <TitleH2 sectionClass="stub__text" title={texts.title} />
      </div>
    </Card>
  );
}

CardStub.propTypes = {
  sectionClass: PropTypes.string,
};

CardStub.defaultProps = {
  sectionClass: '',
};

export default CardStub;
