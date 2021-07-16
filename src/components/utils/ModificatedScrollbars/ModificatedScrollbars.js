import { Scrollbars } from 'react-custom-scrollbars';
import { useRef } from 'react';
import PropTypes from 'prop-types';

function ModificatedScrollbars({ horizontalScrollClass, children }) {
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
      renderThumbVertical={() => <div className={horizontalScrollClass} />}
    >
      {children}
    </Scrollbars>
  );
}

ModificatedScrollbars.propTypes = {
  children: PropTypes.node,
  horizontalScrollClass: PropTypes.string,
};

ModificatedScrollbars.defaultProps = {
  children: null,
  horizontalScrollClass: '',
};

export default ModificatedScrollbars;
