import PropTypes from 'prop-types';
import './Blockquote.scss';

function Blockquote({ wrapperClasses, h3classes, text }) {
  return (
    <blockquote className={wrapperClasses}>
      <h3 className={h3classes}>
        {text}
      </h3>
    </blockquote>
  );
}

Blockquote.propTypes = {
  wrapperClasses: PropTypes.string,
  h3classes: PropTypes.string,
  text: PropTypes.string.isRequired
};

Blockquote.defaultProps = {
  wrapperClasses: '',
  h3classes: ''
};

export default Blockquote;
