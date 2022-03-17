import PropTypes from 'prop-types';
import { refineClassNames } from '../../../utils/utils';
import './Caption.scss';

function Caption({ title, sectionClass }) {
  const classNames = {
    main: refineClassNames(['caption', sectionClass]),
  };

  return <p className={classNames.main}>{title}</p>;
}

Caption.propTypes = {
  title: PropTypes.string,
  sectionClass: PropTypes.string,
};

Caption.defaultProps = {
  title: '',
  sectionClass: '',
};

export default Caption;
