import PropTypes from 'prop-types';
import CardCatalog from '../CardCatalog/CardCatalog';
import './CardsSection.scss';
import { FIGURES } from '../../../config/constants';
import Paginate from '../../utils/Paginate/Paginate';

function CardsSection({ pageCount, catalogPageData, pageNumber, setPageNumber }) {
  return (
    <section className="cards-section">
      <div className="cards-section__line" />
      <div className="cards-section__line" />
      <div className="cards-section__line" />
      {catalogPageData.map((item, i) => (
        <CardCatalog
          key={item.id}
          title={item.title}
          image={item.imageUrl}
          shape={FIGURES[i % FIGURES.length]}
        />
      ))}
      <Paginate
        secetionClass="cards-section__pagination"
        pageCount={pageCount}
        value={pageNumber}
        onChange={setPageNumber}
      />
    </section>
  );
}

CardsSection.propTypes = {
  pageCount: PropTypes.number,
  catalogPageData: PropTypes.arrayOf(PropTypes.object),
  pageNumber: PropTypes.number,
  setPageNumber: PropTypes.func,
};

CardsSection.defaultProps = {
  pageCount: 0,
  catalogPageData: [],
  pageNumber: 0,
  setPageNumber: () => {},
};

export default CardsSection;
