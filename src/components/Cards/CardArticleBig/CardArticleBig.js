import PropTypes from 'prop-types';
import texts from './locales/RU';
import { Card, Heading, LinkableComponent, StyledLink } from '../../utils';
import './CardArticleBig.scss';

function CardArticleBig({ title, color, articleUrl }) {
  return (
    <Card sectionClass="card-article" color={color}>
      <LinkableComponent
        Component={Heading}
        path={articleUrl}
        linkSectionClass="card-article__link"
        isExternal
        level={2}
        type="medium"
        sectionClass="card-article__title"
        content={title}
      />
      <StyledLink
        sectionClass="card-article__link"
        path={articleUrl}
        text={texts.linkText}
        isExternal
      />
    </Card>
  );
}

CardArticleBig.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  articleUrl: PropTypes.string,
};

CardArticleBig.defaultProps = {
  color: 'white',
  title: '',
  articleUrl: '#',
};

export default CardArticleBig;
