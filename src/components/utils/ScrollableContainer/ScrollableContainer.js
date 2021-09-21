import './ScrollableContainer.scss';
import PropTypes from 'prop-types';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useInfiniteScroll } from '../../../hooks';

const DELAY_NO_POINTER_EVENTS = 100;
const DEFAULT_DELTA_Y = 100;

function ScrollableContainer({
  children,
  step,
  sectionClass,
  onScrollCallback,
  useButtons,
  prevButtonClass,
  nextButtonClass,
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

  const prevButtonScroll = () => {
    parentRef.current.scrollTo({
      left: parentRef.current.scrollLeft - DEFAULT_DELTA_Y * step,
      behavior: 'smooth',
    });
  };

  const nextButtonScroll = () => {
    parentRef.current.scrollTo({
      left: parentRef.current.scrollLeft + DEFAULT_DELTA_Y * step,
      behavior: 'smooth',
    });
  };

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
    <>
      {useButtons && renderButtons()}

      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
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
    </>
  );

  function renderButtons() {
    return (
      <>
        <button
          className={`scrollable-container__button scrollable-container__button_prev ${prevButtonClass}`}
          type="button"
          aria-label="Prev"
          title="Prev"
          onClick={prevButtonScroll}
        />
        <button
          className={`scrollable-container__button scrollable-container__button_next ${nextButtonClass}`}
          type="button"
          aria-label="Next"
          title="Next"
          onClick={nextButtonScroll}
        />
      </>
    );
  }
}

ScrollableContainer.propTypes = {
  sectionClass: PropTypes.string,
  children: PropTypes.node,
  step: PropTypes.number,
  onScrollCallback: PropTypes.func,
  useButtons: PropTypes.bool,
  prevButtonClass: PropTypes.string,
  nextButtonClass: PropTypes.string,
};

ScrollableContainer.defaultProps = {
  sectionClass: '',
  children: null,
  step: 1,
  onScrollCallback: () => {},
  useButtons: false,
  prevButtonClass: '',
  nextButtonClass: '',
};

export default ScrollableContainer;
