import './ScrollableByXContainer.scss';
import PropTypes from 'prop-types';
import { useRef } from 'react';

function ScrollableByXContainer({ children, sectionClass }) {
  const classNames = ['x-scrollable-container', sectionClass].join(' ').trim();

  const containerRef = useRef();

  const scrollByWheel = (evt) => {
    evt.preventDefault();
    const el = containerRef.current;
    el.scrollTo({
      left: el.scrollLeft + evt.deltaY * 5,
      behavior: 'smooth'
    });
  };

  return (
    <div
      className={classNames}
      ref={containerRef}
      onWheel={scrollByWheel}
    >
      {children}
    </div>
  );
}

ScrollableByXContainer.propTypes = {
  sectionClass: PropTypes.string,
  children: PropTypes.node
};

ScrollableByXContainer.defaultProps = {
  sectionClass: '',
  children: null
};

export default ScrollableByXContainer;
