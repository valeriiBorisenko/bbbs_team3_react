import './CardPlace.scss';
import PropTypes from 'prop-types';
import texts from './locales/RU';
import { staticImageUrl } from '../../../config/config';
import { PLACES_TITLE } from '../../../config/routes';
import { Rubric, TitleH2, Card, Caption } from '../../utils';
import CardAnnotation from '../CardAnnotation/CardAnnotation';

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
  },
  activityTypes,
  color,
  sectionClass,
  isBig,
  isMainPage,
}) {
  const {
    genderMale,
    genderFemale,
    linkText,
    chosenTagText,
    activityTypeDefault,
  } = texts;
  const cardColor = isBig ? 'yellow' : color;
  const cardSize = isBig ? 'card-place_main' : '';
  const sexType = gender === 'male' ? genderMale : genderFemale;

  const types = activityTypes
    ? activityTypes.reduce((obj, { id, name }) => {
        // eslint-disable-next-line no-param-reassign
        obj[id] = name;
        return obj;
      }, {})
    : null;

  const info = chosen
    ? `${sexType}, ${age} лет, ${
        activityTypes ? types[activityType] : activityTypeDefault
      } отдых`
    : '';

  const renderImage = () => {
    if ((chosen && isBig) || isMainPage) {
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

  return (
    <article className={`card-container ${sectionClass}`}>
      <Card sectionClass={`card-place ${cardSize}`} color={cardColor}>
        {isMainPage && (
          <Rubric title={PLACES_TITLE} sectionClass="card-place__rubric" />
        )}

        {chosen && !isMainPage && (
          <Rubric title={chosenTagText} sectionClass="card-place__rubric" />
        )}

        <div className="card-place__title-wrap">
          <TitleH2 sectionClass="card-place__title" title={title} />
          <Caption sectionClass="card-place__address" title={address} />
        </div>

        {renderImage()}

        {link && (
          <a
            href={link}
            className="link card-place__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkText}
          </a>
        )}
      </Card>

      <CardAnnotation info={info} description={description} isMain={isBig} />
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
  gender: PropTypes.string,
  age: PropTypes.number,
  activityType: PropTypes.number,
  activityTypes: PropTypes.arrayOf(PropTypes.object),
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
  gender: 'male',
  age: 18,
  activityType: 1,
  activityTypes: [],
  color: 'white',
  isBig: false,
  sectionClass: '',
  isMainPage: false,
};

export default CardPlace;
