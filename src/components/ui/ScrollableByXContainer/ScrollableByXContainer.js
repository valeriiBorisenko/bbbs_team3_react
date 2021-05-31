/* eslint-disable consistent-return */
import './ScrollableByXContainer.scss';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

function ScrollableByXContainer({ children, sectionClass }) {
  const classNames = ['x-scrollable-container', sectionClass].join(' ').trim();

  const containerRef = useRef();

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      const scrollByWheel = (evt) => {
        evt.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + evt.deltaY * 3,
          behavior: 'smooth'
        });
      };

      el.addEventListener('wheel', scrollByWheel);

      return () => el.removeEventListener('wheel', scrollByWheel);
    }
  });

  return (
    <div className={classNames} ref={containerRef}>
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
