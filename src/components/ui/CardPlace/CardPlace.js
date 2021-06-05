import './CardPlace.scss';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import CardAnnotation from '../CardAnnotation/CardAnnotation';
import Rubric from '../Rubric/Rubric';
import TitleH2 from '../TitleH2/TitleH2';
import Card from '../Card/Card';
import Caption from '../Caption/Caption';

function CardPlace({
  data: {
    chosen, title, name, imageUrl, link, info, description
  },
  sectionClass
}) {
  return (
    <div
      className={`card-container card-container_type_main-article ${sectionClass}`}
    >
      <Card sectionClass="card-place card-place_main" color="yellow">
        {chosen && (
          <Rubric title="Выбор наставника" sectionClass="card-place__rubric" />
        )}

        <div className="card-place__title-wrap">
          <Link to="/place" className="card-place__link-wrap">
            <TitleH2 sectionClass="card-place__title" title={title} />
          </Link>
          <Caption sectionClass="card-place__name" title={name} />
        </div>

        {chosen && (
          <Link
            to="/place"
            className="card-place__link-wrap card-place__link-wrap_content_article-img"
          >
            <img src={imageUrl} alt={title} className="card-place__image" />
          </Link>
        )}

        <a
          href={link}
          className="link card-place__link"
          target="_blank"
          rel="noopener noreferrer"
        >
          перейти на сайт
        </a>
      </Card>
      <CardAnnotation info={info} description={description} isMain />
    </div>
  );
}

CardPlace.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  chosen: PropTypes.bool,
  title: PropTypes.string,
  name: PropTypes.string,
  imageUrl: PropTypes.string,
  link: PropTypes.string,
  info: PropTypes.string,
  description: PropTypes.string,
  sectionClass: PropTypes.string
};

CardPlace.defaultProps = {
  data: {},
  chosen: false,
  title: '',
  name: '',
  imageUrl: '',
  link: '',
  info: '',
  description: '',
  sectionClass: ''
};

export default CardPlace;
