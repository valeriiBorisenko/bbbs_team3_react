/* eslint-disable no-undef */
/* eslint-disable react/jsx-props-no-spreading */
// /* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import TitleH3 from '../utils/TitleH3/TitleH3';
import { FIGURES } from '../../config/constants';

function ReadAndWatchSection({
  pageSize,
  getDataFromApi,
  CardTemplate,
  path,
  sectionTitle,
}) {
  console.log('ReadAndWatchSection', sectionTitle);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(null);
  const [sectionData, setSectionData] = useState(null);

  console.log(`я на ${pageIndex} странице из ${totalPages} страниц`);

  function addNewData() {
    const offset = pageSize * pageIndex;
    // лучше всего limit умножать на 2 или 3, чтобы получить 2 страницы
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

  // с лоадером: isLoading=true, finally=false
  useEffect(() => {
    const offset = pageSize * pageIndex;
    console.log('offset', offset);
    console.log('pageSize', pageSize);
    // надо сделать так, чтобы запрашивалось 3 страницы хотя бы

    getDataFromApi({ limit: pageSize, offset })
      .then(({ results, count }) => {
        // console.log(count);
        // console.log(pageSize);
        // console.log(count / pageSize);
        setTotalPages(Math.ceil(count / pageSize));
        setSectionData(results);
      })
      .catch((error) => console.log(error));
  }, []);

  function renderCards() {
    if (sectionData) {
      return (
        <>
          {sectionData.map((item, i) => (
            <CardTemplate
              key={item?.id}
              sectionClass="cards-section__item"
              shape={FIGURES[i % FIGURES.length]} // нужно только для 1 вида секции
              {...item}
            />
          ))}
        </>
      );
    }

    return null;
  }

  return (
    <section>
      <div className="readwatch__container">
        <Link className="readwatch__heading-link" to={path}>
          <TitleH3 title={sectionTitle} sectionClass="readwatch__heading" />
        </Link>
      </div>
      <ul className="readwatch__item-grid">{renderCards()}</ul>
    </section>
  );
}

ReadAndWatchSection.propTypes = {
  pageSize: PropTypes.number.isRequired,
  getDataFromApi: PropTypes.number.isRequired,
  CardTemplate: PropTypes.number.isRequired,
  path: PropTypes.string.isRequired,
  sectionTitle: PropTypes.string.isRequired,
};

export default ReadAndWatchSection;

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

/* <CardCatalog {...{}}
              sectionClass="cards-section__item"
              key={item?.id}
              props={...item}
              title={item?.title}
              image={item?.imageUrl}
              shape={FIGURES[index % FIGURES.length]}
            /> */
