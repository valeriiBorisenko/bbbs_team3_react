/* eslint-disable react/jsx-props-no-spreading */
// /* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { TitleH3, CardCatalog } from './index';
import getCatalogPageDatа from '../../api/catalog-page';
import { FIGURES } from '../../config/constants';
// import './ReadAndWatchSection.scss';

function CatalogSliderSection({ pageSize, getDataFromApi, CardTemplate }) {
  console.log('CatalogSliderSection');
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(null);
  const [sectionData, setSectionData] = useState(null);

  console.log(`я на ${pageNumber} странице из ${totalPages} страниц`);

  function addNewData() {
    const offset = pageSize * pageNumber;

    getDataFromApi({ limit: pageSize, offset })
      .then(({ results }) => {
        // setTotalPages(Math.ceil(count / pageSize));
        setSectionData((previousData) => ({
          ...previousData,
          ...results,
        }));
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    const offset = pageSize * pageNumber;

    getDataFromApi({ limit: pageSize, offset })
      .then(({ results, count }) => {
        setTotalPages(Math.ceil(count / pageSize));
        setSectionData(results);
      })
      .catch((error) => console.log(error));
  }, []);

  // function renderCards() {
  //   return (
  //     <>
  //       {sectionData.map((item, index) => (
  //         <CardCatalog
  //           sectionClass="cards-section__item"
  //           key={item?.id}
  //           title={item?.title}
  //           image={item?.imageUrl}
  //           shape={FIGURES[index % FIGURES.length]}
  //         />
  //       ))}
  //     </>
  //   );
  // }

  return (
    <div />
    // <section>
    //   <div className="readwatch__cont ainer">
    //     <Link className="readwatch__heading-link" to={path}>
    //       <TitleH3 title={sectionTitle} sectionClass="readwatch__heading" />
    //     </Link>
    //     <button type="button">назад</button>
    //     <button type="button">вперед</button>
    //   </div>
    //   <ul className="readwatch__item-grid">{renderCards()}</ul>
    // </section>
  );
}

CatalogSliderSection.propTypes = {
  pageSize: PropTypes.number.isRequired,
  getDataFromApi: PropTypes.number.isRequired,
  CardTemplate: PropTypes.number.isRequired,
};

export default CatalogSliderSection;

// как заполнять компоненты карточек
/*
* каталог
<CardCatalog title="" shape="" image="" sectionClass="" />
* статья
<CardArticle data="" color="" sectionClass="" />
* фильмы
<CardFilm data="" handleClick="" children="" />
* видео
<CardFilm data="" handleClick="" children="" />
* книги
<CardBook data="" />
*/

/* <ReactPaginate
  pageCount={pageCount}
  marginPagesDisplayed={0}
  pageRangeDisplayed={perPage}
  containerClassName="readwatch__pagination"
  previousClassName="readwatch__back"
  nextClassName="readwatch__forward"
  previousLinkClassName="readwatch__back-link"
  nextLinkClassName="readwatch__forward-link"
  nextLabel=""
  previousLabel=""
  onPageChange={handlePageClick}
/> */
