import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { refineClassNames } from '../../utils/utils';
import { Loader, Paginate } from '../utils';
import renderThoseDamnedLines from '../../utils/render-lines';
import './CardsSectionWithLines.scss';

const maxTabletWidth = 900;

function CardsSectionWithLines({
  pageCount,
  children,
  pageNumber,
  setPageNumber,
  sectionClass,
  isLoading,
  dataLength,
  pageSize,
}) {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const tablet = window.matchMedia(`(max-width: ${maxTabletWidth}px)`);

    const listener = () => {
      if (tablet.matches) setIsTablet(true);
      else setIsTablet(false);
    };
    listener();

    tablet.addEventListener('change', listener);

    return () => {
      tablet.removeEventListener('change', listener);
    };
  }, []);

  const classNames = {
    main: refineClassNames(['cards-section', sectionClass]),
  };

  return (
    <>
      {isLoading ? (
        <Loader isPaginate />
      ) : (
        <>
          <section className={classNames.main}>
            {renderThoseDamnedLines(dataLength, pageSize, isTablet)}
            {children}
          </section>
        </>
      )}

      {pageCount > 1 && (
        <Paginate
          sectionClass="cards-section__pagination cards-section__pagination_no-padding"
          pageCount={pageCount}
          value={pageNumber}
          onChange={setPageNumber}
        />
      )}
    </>
  );
}

CardsSectionWithLines.propTypes = {
  pageCount: PropTypes.number,
  children: PropTypes.node,
  pageNumber: PropTypes.number,
  setPageNumber: PropTypes.func,
  sectionClass: PropTypes.string,
  isLoading: PropTypes.bool,
  dataLength: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
};

CardsSectionWithLines.defaultProps = {
  pageCount: 0,
  children: null,
  pageNumber: 0,
  setPageNumber: () => {},
  sectionClass: '',
  isLoading: false,
};

export default CardsSectionWithLines;
