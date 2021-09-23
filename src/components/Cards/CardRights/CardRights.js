import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Rubric } from '../../utils/index';
import CardFigure from '../CardFigure/CardFigure';
import './CardRights.scss';

function CardRights({
  title,
  tags,
  shape,
  color,
  sectionClass,
  id,
  getActiveTags,
}) {
  return (
    <div className={`rights-card ${sectionClass}`}>
      <Link
        to={{
          pathname: `/rights/${id}`,
          state: { fromRightsPage: true, activeTags: getActiveTags() },
        }}
        className="rights-card__link"
      >
        <CardFigure shape={shape} title={title} color={color}>
          <div className="rights-card__block">
            {tags.map((tag) => (
              <Rubric
                key={tag.id}
                sectionClass="rights-card__rubric"
                title={tag.name}
              />
            ))}
          </div>
        </CardFigure>
      </Link>
    </div>
  );
}

CardRights.propTypes = {
  title: PropTypes.string,
  shape: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(Array),
  color: PropTypes.string,
  sectionClass: PropTypes.string,
  id: PropTypes.number.isRequired,
  getActiveTags: PropTypes.func,
};

CardRights.defaultProps = {
  title: '',
  tags: [],
  color: '',
  sectionClass: '',
  getActiveTags: () => {},
};

export default CardRights;
