import PropTypes from 'prop-types';
import { refineClassNames } from '../../../utils/utils';
import './Card.scss';

function Card({ color, sectionClass, children }) {
  const classNames = {
    main: refineClassNames(['card', `card_color_${color}`, sectionClass]),
  };

  return <div className={classNames.main}>{children}</div>;
}

Card.propTypes = {
  color: PropTypes.string,
  sectionClass: PropTypes.string,
  children: PropTypes.node,
};

Card.defaultProps = {
  color: 'white',
  sectionClass: '',
  children: null,
};

export default Card;
