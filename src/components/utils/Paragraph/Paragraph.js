import './Paragraph.scss';
import PropTypes from 'prop-types';

function Paragraph({ size, content, reference, sectionClass }) {
  const classNames = ['paragraph', `paragraph_${size}`, sectionClass]
    .join(' ')
    .trim();

  return (
    <p ref={reference} className={classNames}>
      {content}
    </p>
  );
}

Paragraph.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  reference: PropTypes.objectOf(PropTypes.any),
  size: PropTypes.string,
  sectionClass: PropTypes.string,
};

Paragraph.defaultProps = {
  content: 'Paragraph',
  reference: null,
  size: 'default',
  sectionClass: '',
};

export default Paragraph;
