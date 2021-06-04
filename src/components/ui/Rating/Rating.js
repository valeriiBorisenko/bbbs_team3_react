import './Rating.scss';
import PropTypes from 'prop-types';

function Rating({
  type, name, value, ratingType, sectionClass, checked, onClick
}) {
  const classNames = ['rating', sectionClass].join(' ').trim();

  const handleClick = (evt) => {
    onClick(evt);
  };

  const pseudoButtonClassNames = [
    'rating__pseudo-button',
    `rating__pseudo-button_type_${ratingType}_default`
  ].join(' ').trim();

  return (
    <label className={classNames} htmlFor={`rating-${name}-${value}`}>
      <input
        id={`rating-${name}-${value}`}
        className="rating__checkbox"
        type={type}
        name={name}
        value={value}
        defaultChecked={checked}
        onClick={handleClick}
      />
      <span className={pseudoButtonClassNames} />
    </label>
  );
}

Rating.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  ratingType: PropTypes.string,
  sectionClass: PropTypes.string,
  checked: PropTypes.bool,
  onClick: PropTypes.func
};

Rating.defaultProps = {
  name: '',
  ratingType: 'neutral',
  sectionClass: '',
  checked: false,
  onClick: undefined
};

export default Rating;