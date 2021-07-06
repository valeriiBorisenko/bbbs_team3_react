import './CardCatalog.scss';
import PropTypes from 'prop-types';
import { TitleH2 } from '../../utils/index';
import CardFigure from '../CardFigure/CardFigure';

function CardCatalog({ title, shape, image, sectionClass, link }) {
  return (
    <div className={`card-catalog ${sectionClass}`}>
      <Link to={link} className="card-catalog__link-wrap">
        <CardFigure sectionClass="card-catalog_type_shaped" shape={shape}>
          <img className="card-catalog__image" src={image} alt={title} />
        </CardFigure>
        <TitleH2 sectionClass="card-catalog__title" title={title} />
      </Link>
    </div>
  );
}

CardCatalog.propTypes = {
  title: PropTypes.string,
  shape: PropTypes.string,
  image: PropTypes.string,
  sectionClass: PropTypes.string,
  link: PropTypes.string,
};

CardCatalog.defaultProps = {
  title: '',
  shape: 'square',
  image: '',
  sectionClass: '',
  link: '',
};

export default CardCatalog;
