import PropTypes from 'prop-types';
import './Caption.scss';

function Caption({ title, sectionClass }) {
  const classNames = ['caption', sectionClass].join(' ').trim();

  return <p className={classNames}>{title}</p>;
}

Caption.propTypes = {
  title: PropTypes.string,
  sectionClass: PropTypes.string,
};

Caption.defaultProps = {
  title: 'Caption',
  sectionClass: '',
};

export default Caption;
