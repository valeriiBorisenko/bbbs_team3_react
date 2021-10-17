import PropTypes from 'prop-types';
import texts from './locales/RU';
import { Card, Heading, StyledLink } from '../../utils';
import './CardArticleBig.scss';

function CardArticleBig({ title, color, articleUrl }) {
  return (
    <Card sectionClass="card-article" color={color}>
      <a
        href={articleUrl}
        className="card-article__link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Heading
          level={2}
          type="medium"
          sectionClass="card-article__title"
          content={title}
        />
      </a>
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
