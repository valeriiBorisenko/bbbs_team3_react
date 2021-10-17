import PropTypes from 'prop-types';
import texts from './locales/RU';
import { Card, Heading, LinkableComponent, Logo } from '../../utils';
import './CardStub.scss';

function CardStub({ sectionClass }) {
  return (
    <Card sectionClass={`stub ${sectionClass}`} color="green">
      <div className="stub__upper-element">
        <LinkableComponent
          Component={Logo}
          linkSectionClass="stub__logo"
          path={texts.link}
          isExternal
        />
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
