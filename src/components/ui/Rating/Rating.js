/* eslint-disable jsx-a11y/label-has-associated-control */
import './Rating.scss';
import PropTypes from 'prop-types';

function Rating({
  type, name, value, ratingType, sectionClass, checked
}) {
  const classNames = ['rating', sectionClass].join(' ').trim();

  const pseudoButtonClassNames = [
    'rating__pseudo-button',
    `rating__pseudo-button_type_${ratingType}_default`
  ].join(' ').trim();

  return (
    <label className={classNames}>
      <input className="rating__checkbox" type={type} name={name} value={value} checked={checked} />
      <span className={pseudoButtonClassNames} />
    </label>
  );
}

Rating.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  ratingType: PropTypes.string.isRequired,
  sectionClass: PropTypes.string,
  checked: PropTypes.bool
};

Rating.defaultProps = {
  sectionClass: '',
  checked: false
};

export default Rating;
