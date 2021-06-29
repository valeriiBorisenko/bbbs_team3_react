import './CardPlace.scss';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PLACES_URL } from '../../../config/routes';
import { staticImageUrl } from '../../../config/config';
import { activityTypePlaces } from '../../../config/constants';
import { CardAnnotation, Rubric, TitleH2, Card, Caption } from './index';

function CardPlace({
  data: {
    image,
    title,
    description,
    link,
    chosen,
    address,
    gender,
    age,
    activityType,
    tags,
  },
  color,
  sectionClass,
  isBig,
  isMainPage,
}) {
  const cardColor = isBig ? 'yellow' : color;
  const cardSize = isBig ? 'card-place_main' : '';
  const sex = gender === 'male' ? 'Мальчик' : 'Девочка';

  const renderImage = () => {
    if (isMainPage) {
      return (
        <Link
          to={PLACES_URL}
          className="card-place__link-wrap card-place__link-wrap_content_article-img"
        >
          <img
            src={`${staticImageUrl}/${image}`}
            alt={title}
            className="card-place__image"
          />
        </Link>
      );
    }
    if (!isMainPage && chosen && isBig) {
      return (
        <img
          src={`${staticImageUrl}/${image}`}
          alt={title}
          className="card-place__image card-place__image_type_article"
        />
      );
    }
    return null;
  };

  const Test = () => tags.map((t) => t.name).join(',');

  return (
    <article className={`card-container ${sectionClass}`}>
      <Card sectionClass={`card-place ${cardSize}`} color={cardColor}>
        {chosen && (
          <Rubric title="Выбор наставника" sectionClass="card-place__rubric" />
        )}

        <div className="card-place__title-wrap">
          {isMainPage ? (
            <Link to={PLACES_URL} className="card-place__link-wrap">
              <TitleH2 sectionClass="card-place__title" title={title} />
            </Link>
          ) : (
            <TitleH2 sectionClass="card-place__title" title={title} />
          )}
          <Caption sectionClass="card-place__address" title={address} />
          <Caption
            sectionClass="card-place__address card-place__address_test"
            title={Test()}
          />
        </div>

        {renderImage()}

        {link && (
          <a
            href={link}
            className="link card-place__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            перейти на сайт
          </a>
        )}
      </Card>
      <CardAnnotation
        info={`${sex}, ${age} лет, ${activityTypePlaces[activityType]} отдых`}
        description={description}
        isMain={isBig}
      />
    </article>
  );
}

CardPlace.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  chosen: PropTypes.bool,
  title: PropTypes.string,
  address: PropTypes.string,
  image: PropTypes.string,
  link: PropTypes.string,
  description: PropTypes.string,
  color: PropTypes.string,
  sectionClass: PropTypes.string,
  isBig: PropTypes.bool,
  isMainPage: PropTypes.bool,
};

CardPlace.defaultProps = {
  data: {},
  chosen: false,
  title: '',
  address: '',
  image: '',
  link: '',
  description: '',
  color: 'white',
  isBig: false,
  sectionClass: '',
  isMainPage: false,
};

export default CardPlace;
