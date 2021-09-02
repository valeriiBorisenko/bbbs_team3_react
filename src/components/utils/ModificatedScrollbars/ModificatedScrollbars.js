import { Scrollbars } from 'react-custom-scrollbars';
import { useRef } from 'react';
import PropTypes from 'prop-types';

function ModificatedScrollbars({ horizontalScrollClass, children }) {
  const ref = useRef();

  return (
    <Scrollbars
      ref={ref}
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
