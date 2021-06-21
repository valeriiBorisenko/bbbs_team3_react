import PropTypes from 'prop-types';
import TitleH2 from '../../utils/TitleH2/TitleH2';
import CardFigure from '../CardFigure/CardFigure';
import './CardCatalog.scss';

function CardCatalog({ title, shape, image }) {
  return (
    <div className="card-catalog">
      <CardFigure className="card-catalog_type_shaped" shape={shape}>
        <img className="card-catalog__image" src={image} alt={title} />
      </CardFigure>
      <TitleH2 sectionClass="section-title card-catalog__title" title={title} />
    </div>
  );
}

CardCatalog.propTypes = {
  title: PropTypes.string,
  shape: PropTypes.string,
  image: PropTypes.string,
};

CardCatalog.defaultProps = {
  title: '',
  shape: 'square',
  image: '',
};

export default CardCatalog;
