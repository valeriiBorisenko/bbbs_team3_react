import CustomScroll from 'react-custom-scroll';
import PropTypes from 'prop-types';

function ModificatedScrollbars({ children }) {
  return (
    <CustomScroll
    // renderTrackHorizontal={() => <div style={{ opacity: 'none' }} />}
    // renderThumbVertical={() => <div className={horizontalScrollClass} />}
    >
      {children}
    </CustomScroll>
  );
}

ModificatedScrollbars.propTypes = {
  children: PropTypes.node,
};

ModificatedScrollbars.defaultProps = {
  children: null,
};

export default ModificatedScrollbars;
