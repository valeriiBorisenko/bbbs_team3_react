/* eslint-disable jsx-a11y/label-has-associated-control */
import './PseudoButtonCheckbox.scss';
import PropTypes from 'prop-types';

function PseudoButtonCheckbox({
  type,
  name,
  value,
  title,
  datasetForFilter,
  filters,
  onChange,
  onClick
}) {
  const handleChange = (evt) => {
    onChange(evt, filters);
  };

  const handleClick = (evt) => {
    onClick(evt, evt.target.dataset.filter);
  };

  return (
    <label
      className="pseudo-button-label"
    >
      <input
        className="pseudo-button-checkbox"
        type={type}
        name={name}
        value={value}
        data-filter={datasetForFilter}
        onChange={handleChange}
        onClick={handleClick}
      />
      <span
        className="button pseudo-button"
      >
        {title}
      </span>
    </label>
  );
}

PseudoButtonCheckbox.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  title: PropTypes.string,
  filters: PropTypes.objectOf(PropTypes.number),
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  datasetForFilter: PropTypes.string
};

PseudoButtonCheckbox.defaultProps = {
  type: 'radio',
  name: '',
  value: '',
  title: '',
  filters: {},
  datasetForFilter: ''
};

export default PseudoButtonCheckbox;
