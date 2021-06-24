import PropTypes from 'prop-types';
import CardCatalog from '../CardCatalog/CardCatalog';
import './CardsSection.scss';
import { FIGURES } from '../../../config/constants';
import Paginate from '../../utils/Paginate/Paginate';

function CardsSection({ pageCount, pageData, pageNumber, setPageNumber }) {
  return (
    <>
      <section className="cards-section">
        <div className="cards-section__line" />
        <div className="cards-section__line" />
        <div className="cards-section__line" />
        {pageData.map((item, i) => (
          <CardCatalog
            sectionClass="cards-section__item"
            key={item.id}
            title={item.title}
            image={item.imageUrl}
            shape={FIGURES[i % FIGURES.length]}
          />
        ))}
      </section>
      <Paginate
        sectionClass="cards-section__pagination"
        pageCount={pageCount}
        value={pageNumber}
        onChange={setPageNumber}
      />
    </>
  );
}

CardsSection.propTypes = {
  pageCount: PropTypes.number,
  pageData: PropTypes.arrayOf(PropTypes.object),
  pageNumber: PropTypes.number,
  setPageNumber: PropTypes.func,
};

CardsSection.defaultProps = {
  pageCount: 0,
  pageData: [],
  pageNumber: 0,
  setPageNumber: () => {},
};

export default CardsSection;
