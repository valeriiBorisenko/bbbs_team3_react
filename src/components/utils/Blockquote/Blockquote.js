import PropTypes from 'prop-types';
import { refineClassNames } from '../../../utils/utils';
import './Blockquote.scss';

function Blockquote({ sectionClass, text }) {
  const classNames = {
    main: refineClassNames(['blockquote', sectionClass]),
  };

  return (
    <div className={classNames.main}>
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
  text: '',
};

export default Blockquote;
