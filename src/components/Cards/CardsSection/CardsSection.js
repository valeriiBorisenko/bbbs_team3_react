import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import CardCatalog from '../CardCatalog/CardCatalog';
import './CardsSection.scss';
import Api from '../../../utils/api';
import { FIGURES } from '../../../config/constants';

function CardsSection() {
  const [pageSize, setPageSize] = useState(16);
  const [catalogPageData, setCatalogPageData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const offset = pageSize * pageNumber;
    Api.getCatalogPageData({ limit: pageSize, offset }).then(
      ({ catalog, catalogTotalLength }) => {
        setCatalogPageData(catalog);
        setPageCount(Math.ceil(catalogTotalLength / pageSize));
        setIsLoading(false);
      }
    );
  }, [pageSize, pageNumber]);

  useEffect(() => {
    const smallQuery = window.matchMedia('(max-width: 1439px)');
    const largeQuery = window.matchMedia('(max-width: 1919px)');

    const listener = () => {
      if (smallQuery.matches) {
        setPageSize(4);
      } else if (largeQuery.matches) {
        setPageSize(9);
      } else {
        setPageSize(16);
      }
    };
    listener();

    smallQuery.addEventListener('change', listener);
    largeQuery.addEventListener('change', listener);

    return () => {
      smallQuery.removeEventListener('change', listener);
      largeQuery.removeEventListener('change', listener);
    };
  }, []);

  return (
    <section className="cards-section">
      <div className="cards-section__line" />
      <div className="cards-section__line" />
      <div className="cards-section__line" />
      {!isLoading && catalogPageData.map((item, i) => (
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
        forcePage={pageNumber}
        onPageChange={({ selected }) => setPageNumber(selected)}
      />
    </section>
  );
}

export default CardsSection;
