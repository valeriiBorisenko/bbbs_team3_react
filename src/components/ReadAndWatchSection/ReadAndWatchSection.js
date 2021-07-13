/* eslint-disable react/jsx-props-no-spreading */
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Carousel from 'react-elastic-carousel';
import {
  PAGES_TO_LOAD,
  INDEX_ERROR_FOR_PENULTIMATE_PAGE,
  INDEX_ERROR_BETWEEN_NUMBER_AND_INDEX,
} from './constants';
import {
  TitleH3,
  LinkableHeading,
  NoDataNotificationBox,
  Loader,
} from '../utils/index';
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
  sectionClass,
}) {
  // console.log('ReadAndWatchSection', sectionTitle);
  const { S, M, L, XL } = breakpoints;
  const ref = useRef();

  // индекс страницы
  const [pageIndex, setPageIndex] = useState(0);
  // всего возможных страниц при текущем разрешении
  const [totalPages, setTotalPages] = useState(null);
  const [sectionData, setSectionData] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  // console.log(`размер страницы сейчас: ${pageSize}`);
  // console.log(`я на ${pageIndex} странице из ${totalPages} страниц`);

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

  useEffect(() => {
    const offset = pageSize * pageIndex;
    const loadThreePages = pageSize * 3;
    // console.log(`загрузим данные на ${loadThreePages} элементов`);
    // console.log('offset', offset);
    // console.log('pageSize', pageSize);

    getDataFromApi({ limit: loadThreePages, offset })
      .then(({ results, count }) => {
        setTotalPages(Math.ceil(count / pageSize));
        setSectionData(results);
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  }, [pageSize]);

  function slideBackHandler() {
    // console.log('=== slideBackHandler FUNC');
    setPageIndex((prevIndex) => prevIndex - 1);
  }

  // если хочешь вставить дебаунс, то придется на событие onchange ориентироваться и добавлять одинаковое поведение везде
  // либо надо в slideBackHandler и slideNextHandler прогонять через дебаунс
  function slideNextHandler(currentItem, newPageIndex) {
    // console.log('=== slideToNextHandler FUNC');
    // console.log('newPageIndex', newPageIndex);
    // console.log('totalPages', totalPages);

    const pagesLoadedNow = ref.current.getNumOfPages();
    // console.log('pagesLoadedNow', pagesLoadedNow);
    const isPenultimatePage =
      pagesLoadedNow - INDEX_ERROR_FOR_PENULTIMATE_PAGE === newPageIndex;
    const isLastPage =
      pagesLoadedNow - INDEX_ERROR_BETWEEN_NUMBER_AND_INDEX === newPageIndex;
    // console.log('pageIndex', pageIndex);
    // console.log('isLastPage', isLastPage);

    const isNoMoreDataToLoad = pagesLoadedNow === totalPages;
    if (isNoMoreDataToLoad) {
      // console.log('==Больше загружать нечего!==');
      return;
    }

    // значит произошел скрол вперед + это предпоследняя страница
    if (isPenultimatePage || isLastPage) {
      // console.log('ЭТО ПРЕДПОСЛЕДНЯЯ ИЛИ ПОСЛЕДНЯЯ СТРАНИЦА');

      addNewData()
        .then(({ results }) => {
          // console.log(
          //   'мы загрузили дополнительные данные и прибавили к текущим'
          // );
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
    // console.log('renderSliderSection');
    if (!isLoading && sectionData && sectionData?.length === 0) {
      // console.log('renderSliderSection === NoDataNotificationBox');
      return (
        <NoDataNotificationBox
          text={paragraphNoContentText}
          sectionClass="no-data-text_padding-both"
        />
      );
    }

    // console.log(pageIndex, totalPages, sectionData);
    if (!isLoading && totalPages && sectionData) {
      // console.log('renderSliderSection === Carousel');
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

    // console.log('NUL-L');
    return <Loader isNested />;
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
      <div className={`readwatch__slider-container ${sectionClass}`}>
        {renderSliderSection()}
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
  breakpoints: PropTypes.objectOf(PropTypes.number).isRequired,
  elemPaddings: PropTypes.arrayOf(PropTypes.number).isRequired,
  transitionDelay: PropTypes.number.isRequired,
  paragraphNoContentText: PropTypes.string.isRequired,
  sectionClass: PropTypes.string,
};

ReadAndWatchSection.defaultProps = {
  sectionClass: '',
};

export default ReadAndWatchSection;
