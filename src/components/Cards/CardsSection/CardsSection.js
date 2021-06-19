import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import CardCatalog from '../CardCatalog/CardCatalog';
import './CardsSection.scss';
import Api from '../../../utils/api';
import { FIGURES } from '../../../config/constants';

function CardsSection() {
  const pageSize = 16;
  const [catalogPageData, setCatalogPageData] = useState([]);
  const [pageCount, setPageCount] = useState(null);
  useEffect(() => {
    Api.getCatalogPageData({ limit: pageSize }).then(
      ({ catalog, catalogTotalLength }) => {
        setCatalogPageData(catalog);
        setPageCount(Math.ceil(catalogTotalLength / pageSize));
      }
    );
  }, []);
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
      <ReactPaginate
        containerClassName="cards-section__pagination-container"
        pageClassName="cards-section__pagination-element"
        pageLinkClassName="cards-section__pagination-element-link"
        activeLinkClassName="cards-section__pagination-element-link_type_active"
        previousClassName="cards-section__pagination-element cards-section__pagination-arrow-element cards-section__pagination-arrow-element_type_previous"
        breakClassName="cards-section__pagination-element"
        nextClassName="cards-section__pagination-element cards-section__pagination-arrow-element"
        disabledClassName="cards-section__pagination-arrow-element_type_disabled"
        pageCount={pageCount}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
      />
    </section>
  );
}

export default CardsSection;
