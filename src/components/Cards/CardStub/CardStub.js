import PropTypes from 'prop-types';
import texts from './locales/RU';
import { Card, Heading, Logo } from '../../utils';
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
        <Heading
          level={2}
          type="small"
          sectionClass="stub__text"
          content={texts.title}
        />
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
