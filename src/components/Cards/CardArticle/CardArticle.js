import './CardArticle.scss';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import texts from './locales/RU';
import { staticImageUrl } from '../../../config/config';
import CardAnnotation from '../CardAnnotation/CardAnnotation';
import { TitleH2, Card, Caption } from '../../utils/index';

function CardArticle({
  data: { title, info, annotation, image, articleUrl },
  isMain,
  color,
}) {
  const cardColor = isMain ? 'yellow' : color;

  return (
    <article
      className={`card-container ${
        isMain
          ? 'card-container_type_main-article'
          : 'card-container_type_article fade-in'
      }`}
    >
      <Card
        sectionClass={`article-card ${isMain ? 'article-card_main' : ''}`}
        color={cardColor}
      >
        <div className="article-card__title-wrap">
          <Link to={articleUrl} className="article-card__link-wrap">
            <TitleH2 sectionClass="article-card__title" title={title} />
          </Link>
          <Caption sectionClass="article-card__info" title={info} />
        </div>

        {isMain && (
          <Link
            to={articleUrl}
            className="article-card__link-wrap article-card__link-wrap_content_article-img"
          >
            <img
              src={`${staticImageUrl}/${image}`}
              alt={title}
              className="article-card__image"
            />
          </Link>
        )}

        <a
          href={articleUrl}
          className="link article-card__link"
          target="_blank"
          rel="noopener noreferrer"
        >
          {texts.linkText}
        </a>
      </Card>
      <CardAnnotation description={annotation} isMain={isMain} />
    </article>
  );
}

CardArticle.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  info: PropTypes.string,
  image: PropTypes.string,
  articleUrl: PropTypes.string,
  annotation: PropTypes.string,
  color: PropTypes.string,
  isMain: PropTypes.bool,
};

CardArticle.defaultProps = {
  data: {},
  title: '',
  info: '',
  image: '',
  articleUrl: '',
  annotation: '',
  color: 'white',
  isMain: false,
};

export default CardArticle;
