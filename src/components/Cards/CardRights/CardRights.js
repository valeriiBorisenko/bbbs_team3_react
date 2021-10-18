import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { refineClassNames } from '../../../utils/utils';
import { Rubric } from '../../utils';
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
  const classNames = {
    main: refineClassNames(['rights-card', sectionClass]),
  };

  return (
    <div className={classNames.main}>
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
  getActiveTags: undefined,
};

export default CardRights;
