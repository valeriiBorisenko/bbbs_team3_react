import PropTypes from 'prop-types';
import { refineClassNames } from '../../../utils/utils';
import './Rating.scss';

function Rating({
  type,
  name,
  value,
  ratingType,
  sectionClass,
  checked,
  onChange,
}) {
  const classNames = {
    main: refineClassNames(['rating', sectionClass]),
    button: refineClassNames([
      'rating__pseudo-button',
      `rating__pseudo-button_type_${ratingType}_default`,
    ]),
  };

  return (
    <label className={classNames.main} htmlFor={`rating-${name}-${value}`}>
      <input
        id={`rating-${name}-${value}`}
        className="rating__checkbox"
        type={type}
        name={name}
        value={value}
        defaultChecked={checked}
        onChange={onChange}
      />
      <span className={classNames.button} />
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
  onChange: PropTypes.func,
};

Rating.defaultProps = {
  name: '',
  value: 'neutral',
  ratingType: 'neutral',
  sectionClass: '',
  checked: false,
  onChange: undefined,
};

export default Rating;
