/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable consistent-return */
import './ScrollableContainer.scss';
import PropTypes from 'prop-types';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

const DELAY_NO_POINTER_EVENTS = 150;

function ScrollableContainer({ children, step, sectionClass }) {
  const ref = useRef();
  const [state, setState] = useState({
    isScrolling: false,
    clientX: 0,
    scrollX: 0,
  });

  const scrollByWheel = useCallback(
    (evt) => {
      if (ref && ref.current) {
        evt.preventDefault();
        ref.current.scrollTo({
          left: ref.current.scrollLeft + evt.deltaY * step,
          behavior: 'smooth',
        });
      }
    },
    [ref.current]
  );

  useLayoutEffect(() => {
    if (ref && ref.current) {
      ref.current.addEventListener('wheel', scrollByWheel);
      return () => ref.current.removeEventListener('wheel', scrollByWheel);
    }
  }, [ref.current]);

  const onMouseDown = (evt) => {
    if (ref && ref.current && !ref.current.contains(evt.target)) {
      return;
    }
    evt.preventDefault();
    setTimeout(() => {
      setState({
        ...state,
        isScrolling: true,
        clientX: evt.clientX,
      });
    }, DELAY_NO_POINTER_EVENTS);
  };

  const onMouseUp = (evt) => {
    if (ref && ref.current && !ref.current.contains(evt.target)) {
      return;
    }
    evt.preventDefault();
    setState({
      ...state,
      isScrolling: false,
    });
  };

  const onMouseMove = (evt) => {
    if (ref && ref.current && !ref.current.contains(evt.target)) {
      return;
    }
    const { clientX, scrollX, isScrolling } = state;
    if (isScrolling) {
      ref.current.scrollLeft = scrollX - evt.clientX + clientX;
      setState({
        ...state,
        scrollX: scrollX - evt.clientX + clientX,
        clientX: evt.clientX,
      });
    }
  };

  const onMouseLeave = (evt) => {
    if (ref && ref.current && !ref.current.contains(evt.target)) {
      return;
    }
    evt.preventDefault();
    setState({
      ...state,
      isScrolling: false,
    });
  };

  const classNames = [
    'scrollable-container',
    state.isScrolling ? 'scrollable-container_scrolling' : '',
    sectionClass,
  ]
    .join(' ')
    .trim();

  return (
    <div
      className={classNames}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      ref={ref}
    >
      {children}
    </div>
  );
}

ScrollableContainer.propTypes = {
  sectionClass: PropTypes.string,
  children: PropTypes.node,
  step: PropTypes.number,
};

ScrollableContainer.defaultProps = {
  sectionClass: '',
  children: null,
  step: 1,
};

export default ScrollableContainer;
