import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { refineClassNames } from '../../../utils/utils';
import { Heading } from '../../utils';
import CardFigure from '../CardFigure/CardFigure';
import { staticImageUrl } from '../../../config/config';
import './CardCatalog.scss';

function CardCatalog({ data: { id, title, image }, shape, sectionClass }) {
  const link = `/catalog/${id}`;
  const classNames = {
    main: refineClassNames(['card-catalog', sectionClass]),
  };

  return (
    <div className={classNames.main}>
      <Link to={link} className="card-catalog__link-wrap">
        <div className="card-catalog__image-wrap">
          <CardFigure
            sectionClass="card-catalog_type_shaped"
            shape={shape}
            color="white"
          >
            {image && (
              <img
                draggable="false"
                className="card-catalog__image"
                src={`${staticImageUrl}/${image}`}
                alt={title}
                loading="lazy"
              />
            )}
          </CardFigure>
        </div>
        <Heading
          level={2}
          type="small"
          sectionClass="card-catalog__title"
          content={title}
        />
      </Link>
    </div>
  );
}

CardCatalog.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  shape: PropTypes.string.isRequired,
  image: PropTypes.string,
  sectionClass: PropTypes.string,
};

CardCatalog.defaultProps = {
  data: {},
  title: '',
  image: '',
  sectionClass: '',
};

export default CardCatalog;
