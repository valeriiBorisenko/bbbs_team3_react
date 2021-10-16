import './Paragraph.scss';
import PropTypes from 'prop-types';

function Paragraph({ size, content, sectionClass }) {
  const classNames = ['paragraph', `paragraph_${size}`, sectionClass]
    .join(' ')
    .trim();

  return <p className={classNames}>{content}</p>;
}

Paragraph.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  size: PropTypes.string,
  sectionClass: PropTypes.string,
};

Paragraph.defaultProps = {
  content: 'Paragraph',
  size: 'default',
  sectionClass: '',
};

export default Paragraph;
