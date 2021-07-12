/* eslint-disable no-undef */
/* eslint-disable react/jsx-props-no-spreading */
// /* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Carousel from 'react-elastic-carousel';
import { TitleH3, LinkableHeading } from './index';
import { FIGURES, COLORS } from '../../config/constants';

function ReadAndWatchSection({
  pageSize,
  getDataFromApi,
  CardTemplateComponent,
  path,
  sectionTitle,
}) {
  console.log('ReadAndWatchSection', sectionTitle);
  const ref = useRef();

  // индекс страницы
  const [pageIndex, setPageIndex] = useState(0);
  // всего возможных страниц при текущем разрешении
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
    // Логика: при добавлении новых блоков нужно загрузить 3 страницы начиная с последнего имеющегося элемента
    const offset = sectionData.length;
    const loadThreePages = pageSize * 3;
    // лучше всего limit умножать на 2 или 3, чтобы получить 2 страницы
    return getDataFromApi({ limit: loadThreePages, offset });
  }

  // с лоадером: isLoading=true, finally=false
  useEffect(() => {
    const offset = pageSize * pageIndex;
    const loadThreePages = pageSize * 3;
    console.log(`загрузим данные на ${loadThreePages} элементов`);
    console.log('offset', offset);
    console.log('pageSize', pageSize);
    // надо сделать так, чтобы запрашивалось 3 страницы хотя бы

    getDataFromApi({ limit: loadThreePages, offset })
      .then(({ results, count }) => {
        // console.log(count);
        // console.log(pageSize);
        // console.log(count / pageSize);
        setTotalPages(Math.ceil(count / pageSize));
        setSectionData(results);
      })
      .catch((error) => console.log(error));
  }, [pageSize]);

  function slideBackHandler() {
    console.log('=== slideBackHandler FUNC');
    setPageIndex((prevIndex) => prevIndex - 1);
  }

  // если хочешь вставить дебаунс, то придется на событие onchange ориентироваться и добавлять одинаковое поведение везде
  // либо надо в slideBackHandler и slideNextHandler прогонять через дебаунс
  function slideNextHandler(currentItem, newPageIndex) {
    // console.log(currentItem);
    console.log('=== slideToNextHandler FUNC');
    console.log('newPageIndex', newPageIndex);
    console.log('totalPages', totalPages);

    const pagesLoadedNow = ref.current.getNumOfPages();
    console.log('pagesLoadedNow', pagesLoadedNow);
    const isPenultimatePage = pagesLoadedNow - 2 === newPageIndex;
    const isLastPage = pagesLoadedNow - 1 === newPageIndex;
    console.log('pageIndex', pageIndex);
    console.log('isLastPage', isLastPage);

    const isNoMoreDataToLoad = pagesLoadedNow === totalPages;
    if (isNoMoreDataToLoad) {
      console.log('==Больше загружать нечего!==');
      return;
    }

    // значит произошел скрол вперед + это предпоследняя страница
    if (isPenultimatePage || isLastPage) {
      console.log('ЭТО ПРЕДПОСЛЕДНЯЯ ИЛИ ПОСЛЕДНЯЯ СТРАНИЦА');

      // sectionData.length
      addNewData()
        .then(({ results }) => {
          console.log(
            'мы загрузили дополнительные данные и прибавили к текущим'
          );
          setSectionData((previousData) => [...previousData, ...results]);
          setPageIndex((prevIndex) => prevIndex + 1);
        })
        .catch((error) => console.log(error));
    } else {
      setPageIndex((prevIndex) => prevIndex + 1);
    }
  }

  function renderCardsForSlider() {
    if (sectionData) {
      const cardArray = sectionData.map((item, i) => {
        console.log(item);
        return (
          <CardTemplateComponent
            key={`${sectionTitle}-${item?.id}`}
            sectionClass="cards-section__item"
            // для "статей" надо добавлять card-container_type_article
            // для секции Фильмы, Книги, Видео, Статьи
            data={item}
            // для секции Справочник
            shape={FIGURES[i % FIGURES.length]}
            // для секции Статьи
            color={COLORS[(i + 1) % COLORS.length]}
            {...item}
          />
        );
      });

      return cardArray;
    }
    return [];
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
          ref={ref}
          transitionMs={900}
          pagination={false}
          outerSpacing={0}
          itemPadding={slidesPadding}
          breakPoints={breakPoints}
          disableArrowsOnEnd
          showEmptySlots
          onNextEnd={slideNextHandler}
          onPrevEnd={slideBackHandler}
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
  CardTemplateComponent: PropTypes.func.isRequired,
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
<CardFilm data="" />
* видео
<CardFilm data="" />
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
