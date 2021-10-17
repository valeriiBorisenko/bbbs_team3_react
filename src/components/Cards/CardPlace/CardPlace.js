import PropTypes from 'prop-types';
import texts from './locales/RU';
import { staticImageUrl } from '../../../config/config';
import { PLACES_TITLE } from '../../../config/routes';
import { Caption, Card, Heading, Rubric, StyledLink } from '../../utils';
import CardAnnotation from '../CardAnnotation/CardAnnotation';
import './CardPlace.scss';

function CardPlace({
  data,
  activityTypesSimplified,
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
  const sexType = data?.gender === 'male' ? genderMale : genderFemale;

  const imageClassNames = [
    'card-place__image',
    'card-place__image_type_article',
    data?.link ? '' : 'card-place__image_big',
  ]
    .join(' ')
    .trim();

  const info =
    data?.chosen && data?.age && data?.activityType
      ? `${sexType}, ${data.age} лет, ${
          activityTypesSimplified
            ? activityTypesSimplified[data.activityType]
            : activityTypeDefault
        } отдых`
      : '';

  return (
    data && (
      <article className={`card-container ${sectionClass}`}>
        <Card sectionClass={`card-place ${cardSize}`} color={cardColor}>
          {isMainPage && (
            <Rubric title={PLACES_TITLE} sectionClass="card-place__rubric" />
          )}

          {data.chosen && !isMainPage && (
            <Rubric title={chosenTagText} sectionClass="card-place__rubric" />
          )}

          <div className="card-place__title-wrap">
            <Heading
              level={2}
              type="small"
              sectionClass="card-place__title"
              content={data.title}
            />
            <Caption sectionClass="card-place__address" title={data.address} />
          </div>

          {renderImage()}

          {data.link && (
            <StyledLink
              path={data.link}
              sectionClass="card-place__link"
              text={linkText}
              isExternal
            />
          )}
        </Card>

        <CardAnnotation
          info={info}
          description={data.description}
          isMain={isBig}
        />
      </article>
    )
  );

  function renderImage() {
    if ((data?.chosen && isBig) || isMainPage) {
      return (
        <img
          src={`${staticImageUrl}/${data.image}`}
          alt={data.title}
          className={imageClassNames}
        />
      );
    }
    return null;
  }
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
  activityTypesSimplified: PropTypes.objectOf(PropTypes.any),
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
  activityTypesSimplified: {},
  color: 'white',
  isBig: false,
  sectionClass: '',
  isMainPage: false,
};

export default CardPlace;
