import './ScrollableContainer.scss';
import PropTypes from 'prop-types';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import texts from './locales/RU';
import { useInfiniteScroll } from '../../../hooks';

const DELAY_NO_POINTER_EVENTS = 150;
const DEFAULT_DELTA_Y = 100;

function ScrollableContainer({
  children,
  step,
  sectionClass,
  onScrollCallback,
  useButtons,
  disableMouseDrag,
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

  const scrollHandler = (deltaY) => {
    parentRef.current.scrollTo({
      left: parentRef.current.scrollLeft + deltaY * step,
      behavior: 'smooth',
    });
  };

  const scrollByWheel = useCallback(
    (evt) => {
      if (parentRef && parentRef.current) {
        evt.preventDefault();
        scrollHandler(evt.deltaY);
      }
    },
    [parentRef.current]
  );

  const scrollByButtons = (type) => {
    const deltaY = type === 'prev' ? -DEFAULT_DELTA_Y : DEFAULT_DELTA_Y;
    scrollHandler(deltaY);
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
    state.isScrolling && !disableMouseDrag
      ? 'scrollable-container_scrolling'
      : '',
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
        onMouseDown={disableMouseDrag ? undefined : onMouseDown}
        onMouseMove={disableMouseDrag ? undefined : onMouseMove}
        onMouseUp={disableMouseDrag ? undefined : onMouseUp}
        onMouseLeave={disableMouseDrag ? undefined : onMouseLeave}
        ref={parentRef}
      >
        {children}
        <div
          className="scrollable-container__callback-anchor"
          ref={childRef}
          aria-hidden
        >
          .
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
          aria-label={texts.ariaLabelPrevButton}
          onClick={() => scrollByButtons('prev')}
        />
        <button
          className={`scrollable-container__button scrollable-container__button_next ${nextButtonClass}`}
          type="button"
          aria-label={texts.ariaLabelNextButton}
          onClick={() => scrollByButtons('next')}
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
  disableMouseDrag: PropTypes.bool,
};

ScrollableContainer.defaultProps = {
  sectionClass: '',
  children: null,
  step: 1,
  onScrollCallback: () => {},
  useButtons: false,
  prevButtonClass: '',
  nextButtonClass: '',
  disableMouseDrag: false,
};

export default ScrollableContainer;
