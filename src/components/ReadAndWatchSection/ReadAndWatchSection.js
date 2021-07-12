/* eslint-disable react/jsx-props-no-spreading */
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Carousel from 'react-elastic-carousel';
import {
  PAGES_TO_LOAD,
  INDEX_ERROR_FOR_PENULTIMATE_PAGE,
  INDEX_ERROR_BETWEEN_NUMBER_AND_INDEX,
} from './constants';
import { TitleH3, LinkableHeading, NoDataNotificationBox } from './index';
import { FIGURES, COLORS } from '../../config/constants';

function ReadAndWatchSection({
  pageSize,
  getDataFromApi,
  CardTemplateComponent,
  path,
  sectionTitle,
  breakpoints,
  elemPaddings,
  transitionDelay,
  paragraphNoContentText,
}) {
  console.log('ReadAndWatchSection', sectionTitle);
  const { S, M, L, XL } = breakpoints;
  const ref = useRef();

  // индекс страницы
  const [pageIndex, setPageIndex] = useState(0);
  // всего возможных страниц при текущем разрешении
  const [totalPages, setTotalPages] = useState(null);
  const [sectionData, setSectionData] = useState(null);

  console.log(`размер страницы сейчас: ${pageSize}`);
  console.log(`я на ${pageIndex} странице из ${totalPages} страниц`);
  console.log('paragraphNoContentText', paragraphNoContentText);

  const breakPoints = [
    { width: S, itemsToShow: pageSize, itemsToScroll: pageSize },
    { width: M, itemsToShow: pageSize, itemsToScroll: pageSize },
    { width: L, itemsToShow: pageSize, itemsToScroll: pageSize },
    { width: XL, itemsToShow: pageSize, itemsToScroll: pageSize },
  ];

  function addNewData() {
    // Логика: при добавлении новых блоков нужно загрузить 3 страницы начиная с последнего имеющегося элемента
    const offset = sectionData.length;
    const loadThreePages = pageSize * PAGES_TO_LOAD;
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
    console.log('=== slideToNextHandler FUNC');
    console.log('newPageIndex', newPageIndex);
    console.log('totalPages', totalPages);

    const pagesLoadedNow = ref.current.getNumOfPages();
    console.log('pagesLoadedNow', pagesLoadedNow);
    const isPenultimatePage =
      pagesLoadedNow - INDEX_ERROR_FOR_PENULTIMATE_PAGE === newPageIndex;
    const isLastPage =
      pagesLoadedNow - INDEX_ERROR_BETWEEN_NUMBER_AND_INDEX === newPageIndex;
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
      const cardArray = sectionData.map((item, i) => (
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
      ));

      return cardArray;
    }
    return [];
  }

  // <NoDataNotificationBox text={paragraphNoContentText} sectionClass="no-data-text_padding-both" />
  function renderSliderSection() {
    if (sectionData && sectionData?.length === 0) {
      return (
        <NoDataNotificationBox
          text={paragraphNoContentText}
          sectionClass="no-data-text_padding-both"
        />
      );
    }

    return (
      <Carousel
        ref={ref}
        transitionMs={transitionDelay}
        pagination={false}
        outerSpacing={0}
        itemPadding={elemPaddings}
        breakPoints={breakPoints}
        disableArrowsOnEnd
        showEmptySlots
        onNextEnd={slideNextHandler}
        onPrevEnd={slideBackHandler}
      >
        {renderCardsForSlider()}
      </Carousel>
    );
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
      <div className="readwatch__slider-container">{renderSliderSection()}</div>
    </section>
  );
}

ReadAndWatchSection.propTypes = {
  pageSize: PropTypes.number.isRequired,
  getDataFromApi: PropTypes.func.isRequired,
  CardTemplateComponent: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  sectionTitle: PropTypes.string.isRequired,
  breakpoints: PropTypes.objectOf(PropTypes.number).isRequired,
  elemPaddings: PropTypes.arrayOf(PropTypes.number).isRequired,
  transitionDelay: PropTypes.number.isRequired,
  paragraphNoContentText: PropTypes.string,
};

ReadAndWatchSection.defaultProps = {
  paragraphNoContentText: 'Данных нет',
};

export default ReadAndWatchSection;
