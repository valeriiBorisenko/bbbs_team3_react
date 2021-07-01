import './CardArticle.scss';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { CardAnnotation, TitleH2, Card, Caption } from './index';

function CardArticle({
  data: { title, info, annotation, imageUrl },
  isMain,
  color,
  link,
  sectionClass,
}) {
  const cardColor = isMain ? 'yellow' : color;

  return (
    <article className={`card-container ${sectionClass}`}>
      <Card
        sectionClass={`card-article ${isMain ? 'card-article_main' : ''}`}
        color={cardColor}
      >
        <div className="card-article__title-wrap">
          <Link to={link} className="card-article__link-wrap">
            <TitleH2 sectionClass="card-article__title" title={title} />
          </Link>
          <Caption sectionClass="card-article__info" title={info} />
        </div>

        {isMain && (
          <Link
            to={link}
            className="card-article__link-wrap card-article__link-wrap_content_article-img"
          >
            <img src={imageUrl} alt={title} className="card-article__image" />
          </Link>
        )}

        <a
          href={link}
          className="link card-article__link"
          target="_blank"
          rel="noopener noreferrer"
        >
          читать на сайте
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
  imageUrl: PropTypes.string,
  link: PropTypes.string,
  annotation: PropTypes.string,
  color: PropTypes.string,
  sectionClass: PropTypes.string,
  isMain: PropTypes.bool,
};

CardArticle.defaultProps = {
  data: {},
  title: '',
  info: '',
  imageUrl: '',
  link: '',
  annotation: '',
  color: 'white',
  isMain: false,
  sectionClass: '',
};

export default CardArticle;
