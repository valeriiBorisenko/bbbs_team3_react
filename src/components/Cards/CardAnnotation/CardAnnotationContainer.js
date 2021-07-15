import PropTypes from 'prop-types';
import { useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Caption } from '../../utils/index';

function CardAnnotationContainer({ caption, children }) {
  const ref = useRef();

  function showScrollOnMouseOver() {
    ref.current.thumbVertical.parentElement.style.opacity = '1';
  }

  function onMouseLeave() {
    ref.current.thumbVertical.parentElement.style.opacity = '0';
  }

  return (
    <Scrollbars
      ref={ref}
      autoHide
      onMouseOver={showScrollOnMouseOver}
      onMouseLeave={onMouseLeave}
      autoHideTimeout={700}
      autoHideDuration={400}
      renderTrackHorizontal={() => <div style={{ opacity: 'none' }} />}
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
