/* eslint-disable no-undef */
/* eslint-disable react/jsx-props-no-spreading */
// /* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Carousel from 'react-elastic-carousel';
import { TitleH3, LinkableHeading } from './index';
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

  console.log(`размер страницы сейчас: ${pageSize}`);
  console.log(`я на ${pageIndex} странице из ${totalPages} страниц`);

  const slidesPadding = [0, 15, 0, 15]; // вынести в константы
  const breakPoints = [
    { width: 820, itemsToShow: pageSize, itemsToScroll: pageSize },
    { width: 1120, itemsToShow: pageSize, itemsToScroll: pageSize },
    { width: 1440, itemsToShow: pageSize, itemsToScroll: pageSize },
    { width: 1441, itemsToShow: pageSize, itemsToScroll: pageSize },
  ];

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
  }, [pageSize]);

  function slideToNextHandler(currentItem, newPageIndex) {
    // console.log(currentItem);
    console.log('onChange FUNC');
    console.log('newPageIndex', newPageIndex);
    console.log('totalPages', totalPages);

    const isBeforeLastPage = totalPages - 2 === newPageIndex;
    // const isForwardScroll = newPageIndex > pageIndex;
    // const isLastPage = totalPages - 1 === pageIndex;

    // значит произошел скрол вперед + это предпоследняя страница
    if (isBeforeLastPage || isLastPage) {
      setTotalPages();
      setCurrentPageIndex((prev) => prev - 1);
    }
  }

  function renderCardsForSlider() {
    if (sectionData) {
      const cardArray = sectionData.map((item, i) => (
        <CardTemplate
          key={item?.id}
          sectionClass="cards-section__item"
          shape={FIGURES[i % FIGURES.length]} // нужно только для 1 вида секции
          {...item}
          image={item.imageUrl}
        />
      ));

      return cardArray;
    }

    return null;
  }

  return (
    <section className="readwatch__section">
      <div className="readwatch__container">
        <LinkableHeading
          title={sectionTitle}
          path={path}
          titleSectionClass="readwatch__heading"
          linkSectionClass="readwatch__heading-link"
          Component={TitleH3}
        />
      </div>
      {/* мой контейнер */}
      <div className="readwatch__slider-container">
        <Carousel
          pagination={false}
          outerSpacing={0}
          itemPadding={slidesPadding}
          breakPoints={breakPoints}
          disableArrowsOnEnd
          // onChange={onChange}
          showEmptySlots
          onNextEnd={slideToNextHandler}
        >
          {renderCardsForSlider()}
        </Carousel>
      </div>
    </section>
  );
}

ReadAndWatchSection.propTypes = {
  pageSize: PropTypes.number.isRequired,
  getDataFromApi: PropTypes.func.isRequired,
  CardTemplate: PropTypes.func.isRequired,
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

//     <ul className="readwatch__item-grid">{renderCards()}</ul>
// <div className="readwatch__item-grid">
//   <Carousel />
// </div>
