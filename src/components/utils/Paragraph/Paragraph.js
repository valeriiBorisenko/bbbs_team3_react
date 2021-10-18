import PropTypes from 'prop-types';
import { refineClassNames } from '../../../utils/utils';
import './Paragraph.scss';

function Paragraph({ size, content, reference, sectionClass }) {
  const classNames = {
    main: refineClassNames(['paragraph', `paragraph_${size}`, sectionClass]),
  };

  return (
    <p ref={reference} className={classNames.main}>
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
