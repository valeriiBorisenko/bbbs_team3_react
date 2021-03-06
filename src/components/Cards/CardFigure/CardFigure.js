import PropTypes from 'prop-types';
import { refineClassNames } from '../../../utils/utils';
import { Heading } from '../../utils';
import './CardFigure.scss';

function CardFigure({ title, shape, color, children, sectionClass }) {
  const classNames = {
    main: refineClassNames([
      'card-figure',
      `card-figure_color_${color}`,
      `card-figure_form_${shape}`,
      sectionClass,
    ]),
  };

  return (
    <div className={classNames.main}>
      {title && (
        <Heading
          level={2}
          type="small"
          content={title}
          sectionClass="card-figure__title"
        />
      )}
      {children}
    </div>
  );
}

CardFigure.propTypes = {
  title: PropTypes.string,
  shape: PropTypes.string.isRequired,
  color: PropTypes.string,
  children: PropTypes.node,
  sectionClass: PropTypes.string,
};

CardFigure.defaultProps = {
  title: '',
  color: 'yellow',
  children: null,
  sectionClass: '',
};

export default CardFigure;
