import PropTypes from 'prop-types';
import texts from './locales/RU';
import { refineClassNames } from '../../../utils/utils';
import { Card, Heading, LinkableComponent, Logo } from '../../utils';
import './CardStub.scss';

function CardStub({ sectionClass }) {
  const classNames = {
    main: refineClassNames(['stub', sectionClass]),
  };

  return (
    <Card sectionClass={classNames.main} color="green">
      <div className="stub__upper-element">
        <LinkableComponent
          Component={Logo}
          linkSectionClass="stub__logo"
          path={texts.link}
          isExternal
          isWhite
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
