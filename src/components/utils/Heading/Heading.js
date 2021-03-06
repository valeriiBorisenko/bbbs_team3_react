import { createElement } from 'react';
import PropTypes from 'prop-types';
import { refineClassNames } from '../../../utils/utils';
import './Heading.scss';

function Heading({ level, content, type, sectionClass }) {
  const headingLevel = level > 6 || level < 1 ? 2 : level;

  const componentProps = {
    className: refineClassNames(['heading', `heading_${type}`, sectionClass]),
  };

  return createElement(`h${headingLevel}`, componentProps, content);
}

Heading.propTypes = {
  level: PropTypes.number,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  type: PropTypes.string,
  sectionClass: PropTypes.string,
};

Heading.defaultProps = {
  level: 2,
  content: '',
  type: 'medium',
  sectionClass: '',
};

export default Heading;
