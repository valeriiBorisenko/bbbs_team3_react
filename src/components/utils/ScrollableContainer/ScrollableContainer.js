import './ScrollableContainer.scss';
import PropTypes from 'prop-types';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useInfiniteScroll } from '../../../hooks';

const DELAY_NO_POINTER_EVENTS = 150;

function ScrollableContainer({
  children,
  step,
  sectionClass,
  onScrollCallback,
}) {
  const parentRef = useRef(null);
  const childRef = useRef(null);

  useInfiniteScroll(parentRef, childRef, onScrollCallback);

  const [state, setState] = useState({
    isScrolling: false,
    clientX: 0,
    scrollX: 0,
  });

  const scrollByWheel = useCallback(
    (evt) => {
      if (parentRef && parentRef.current) {
        evt.preventDefault();
        parentRef.current.scrollTo({
          left: parentRef.current.scrollLeft + evt.deltaY * step,
          behavior: 'smooth',
        });
      }
    },
    [parentRef.current]
  );

  // eslint-disable-next-line consistent-return
  useLayoutEffect(() => {
    if (parentRef && parentRef.current) {
      parentRef.current.addEventListener('wheel', scrollByWheel);
      return () =>
        parentRef.current.removeEventListener('wheel', scrollByWheel);
    }
  }, [parentRef.current]);

  const onMouseDown = (evt) => {
    if (
      parentRef &&
      parentRef.current &&
      !parentRef.current.contains(evt.target)
    ) {
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
    if (
      parentRef &&
      parentRef.current &&
      !parentRef.current.contains(evt.target)
    ) {
      return;
    }
    evt.preventDefault();
    setState({
      ...state,
      isScrolling: false,
    });
  };

  const onMouseMove = (evt) => {
    if (
      parentRef &&
      parentRef.current &&
      !parentRef.current.contains(evt.target)
    ) {
      return;
    }
    const { clientX, scrollX, isScrolling } = state;
    if (isScrolling) {
      parentRef.current.scrollLeft = scrollX - evt.clientX + clientX;
      setState({
        ...state,
        scrollX: scrollX - evt.clientX + clientX,
        clientX: evt.clientX,
      });
    }
  };

  const onMouseLeave = (evt) => {
    if (
      parentRef &&
      parentRef.current &&
      !parentRef.current.contains(evt.target)
    ) {
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
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={classNames}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      ref={parentRef}
    >
      {children}
      <div
        className="scrollable-container__callback-anchor"
        ref={childRef}
        aria-hidden
      >
        More
      </div>
    </div>
  );
}

ScrollableContainer.propTypes = {
  sectionClass: PropTypes.string,
  children: PropTypes.node,
  step: PropTypes.number,
  onScrollCallback: PropTypes.func,
};

ScrollableContainer.defaultProps = {
  sectionClass: '',
  children: null,
  step: 1,
  onScrollCallback: () => {},
};

export default ScrollableContainer;
