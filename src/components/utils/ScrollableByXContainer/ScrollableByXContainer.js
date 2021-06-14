import './ScrollableByXContainer.scss';
import PropTypes from 'prop-types';
import { useSmoothHorizontalScroll } from '../../../utils/custom-hooks';

function ScrollableByXContainer({ children, sectionClass }) {
  const classNames = ['x-scrollable-container', sectionClass].join(' ').trim();

  const containerRef = useSmoothHorizontalScroll({ step: 3 });

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
