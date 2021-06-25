import PropTypes from 'prop-types';
import './CardsSectionWithLines.scss';
import Paginate from '../../utils/Paginate/Paginate';

function CardsSectionWithLines({
  pageCount,
  children,
  pageNumber,
  setPageNumber,
}) {
  return (
    <>
      <section className="cards-section">
        <div className="cards-section__line" />
        <div className="cards-section__line" />
        <div className="cards-section__line" />
        {children}
      </section>
      {pageCount > 1 && (
        <Paginate
          sectionClass="cards-section__pagination"
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
};

CardsSectionWithLines.defaultProps = {
  pageCount: 0,
  children: null,
  pageNumber: 0,
  setPageNumber: () => {},
};

export default CardsSectionWithLines;
