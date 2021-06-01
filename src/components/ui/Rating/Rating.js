/* eslint-disable jsx-a11y/label-has-associated-control */
import './Rating.scss';
import PropTypes from 'prop-types';

function Rating({
  type, name, value, ratingType, sectionClass
}) {
  const classNames = ['rating', sectionClass].join(' ').trim();

  const pseudoButtonClassNames = [
    'rating__pseudo-button',
    `rating__pseudo-button_type_${ratingType}_default`
  ].join(' ').trim();

  return (
    <label className={classNames}>
      <input className="rating__checkbox" type={type} name={name} value={value} />
      <span className={pseudoButtonClassNames} />
    </label>
  );
}

Rating.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  ratingType: PropTypes.string.isRequired,
  sectionClass: PropTypes.string
};

Rating.defaultProps = {
  sectionClass: ''
};

export default Rating;
