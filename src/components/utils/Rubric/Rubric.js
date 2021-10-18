import PropTypes from 'prop-types';
import { refineClassNames } from '../../../utils/utils';
import './Rubric.scss';

function Rubric({ title, sectionClass }) {
  const classNames = {
    main: refineClassNames(['rubric', sectionClass]),
  };

  return <span className={classNames.main}>{title}</span>;
}

Rubric.propTypes = {
  title: PropTypes.string,
  sectionClass: PropTypes.string,
};

Rubric.defaultProps = {
  title: '',
  sectionClass: '',
};

export default Rubric;
