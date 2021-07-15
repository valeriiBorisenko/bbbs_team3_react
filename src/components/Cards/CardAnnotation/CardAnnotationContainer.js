import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import { Caption } from '../../utils/index';

function CardAnnotationContainer({ caption, children }) {
  return (
    <Scrollbars
      renderTrackHorizontal={() => <div style={{ display: 'none' }} />}
      renderThumbVertical={() => <div className="card-annotation__thumb" />}
    >
      {caption && (
        <Caption sectionClass="card-annotation__caption" title={caption} />
      )}

      <div className="card-annotation__desc">{children}</div>
    </Scrollbars>
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
