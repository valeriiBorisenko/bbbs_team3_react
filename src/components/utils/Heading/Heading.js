import { createElement } from 'react';
import PropTypes from 'prop-types';
import './Heading.scss';

function Heading({ level, content, type, sectionClass }) {
  const headingLevel = level > 6 || level < 1 ? 2 : level;

  const classNames = ['heading', `heading_${type}`, sectionClass]
    .join(' ')
    .trim();

  const componentProps = {
    className: classNames,
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
  content: 'Heading',
  type: 'medium',
  sectionClass: '',
};

export default Heading;
