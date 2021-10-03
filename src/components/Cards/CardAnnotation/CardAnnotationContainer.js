import PropTypes from 'prop-types';
import { Caption, ModificatedScrollbars } from '../../utils';

function CardAnnotationContainer({ caption, children }) {
  const classNamesDesc = [
    'card-annotation__desc',
    caption ? '' : 'card-annotation__desc_center',
  ]
    .join(' ')
    .trim();

  return (
    <ModificatedScrollbars>
      {caption && (
        <Caption sectionClass="card-annotation__caption" title={caption} />
      )}

      <div className={classNamesDesc}>{children}</div>
    </ModificatedScrollbars>
  );
}

CardAnnotationContainer.propTypes = {
  caption: PropTypes.string,
  children: PropTypes.node,
};

CardAnnotationContainer.defaultProps = {
  caption: null,
  children: null,
};

export default CardAnnotationContainer;
