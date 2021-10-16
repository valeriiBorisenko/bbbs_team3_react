import PropTypes from 'prop-types';
import './Blockquote.scss';

function Blockquote({ sectionClass, text }) {
  const classNames = ['blockquote', sectionClass].join(' ').trim();

  return (
    <div className={classNames}>
      <blockquote className="blockquote__text">{text}</blockquote>
    </div>
  );
}

Blockquote.propTypes = {
  sectionClass: PropTypes.string,
  text: PropTypes.string,
};

Blockquote.defaultProps = {
  sectionClass: '',
  text: 'Blockquote',
};

export default Blockquote;
