import './Rating.scss';
import PropTypes from 'prop-types';

function Rating({
  type,
  name,
  value,
  ratingType,
  sectionClass,
  checked,
  // onClick,
  onChange,
}) {
  const classNames = ['rating', sectionClass].join(' ').trim();

  const pseudoButtonClassNames = [
    'rating__pseudo-button',
    `rating__pseudo-button_type_${ratingType}_default`,
  ]
    .join(' ')
    .trim();

  return (
    <label className={classNames} htmlFor={`rating-${name}-${value}`}>
      <input
        id={`rating-${name}-${value}`}
        className="rating__checkbox"
        type={type}
        name={name}
        value={value}
        defaultChecked={checked}
        // onClick={() => onClick(value)}
        onChange={onChange}
      />
      <span className={pseudoButtonClassNames} />
    </label>
  );
}

Rating.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string,
  value: PropTypes.string,
  ratingType: PropTypes.string,
  sectionClass: PropTypes.string,
  checked: PropTypes.bool,
  // onClick: PropTypes.func,
  onChange: PropTypes.func,
};

Rating.defaultProps = {
  name: '',
  value: 'neutral',
  ratingType: 'neutral',
  sectionClass: '',
  checked: false,
  // onClick: () => {},
  onChange: () => {},
};

export default Rating;
