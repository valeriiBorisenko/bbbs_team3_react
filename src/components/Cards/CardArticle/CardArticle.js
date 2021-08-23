import './CardArticle.scss';
import PropTypes from 'prop-types';
import texts from './locales/RU';
import { staticImageUrl } from '../../../config/config';
import CardAnnotation from '../CardAnnotation/CardAnnotation';
import { TitleH2, Card, Caption } from '../../utils/index';

function CardArticle({
  data: { title, info, annotation, image, articleUrl },
  isMain,
  color,
  sectionClass,
}) {
  const classNames = [
    'card-container',
    isMain
      ? 'card-container_type_main-article'
      : 'card-container_type_article fade-in',
    sectionClass,
  ]
    .join(' ')
    .trim();
  const cardColor = isMain ? 'yellow' : color;

  return (
    <article className={classNames}>
      <Card
        sectionClass={`article-card ${isMain ? 'article-card_main' : ''}`}
        color={cardColor}
      >
        <div className="article-card__title-wrap">
          <a
            href={articleUrl}
            className="article-card__link-wrap"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TitleH2 sectionClass="article-card__title" title={title} />
          </a>
          <Caption sectionClass="article-card__info" title={info} />
        </div>

        {isMain && (
          <div className="article-card__link-wrap article-card__link-wrap_content_article-img">
            <img
              src={`${staticImageUrl}/${image}`}
              alt={title}
              className="article-card__image image-scale"
            />
          </div>
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
  sectionClass: PropTypes.string,
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
  sectionClass: '',
};

export default CardArticle;
