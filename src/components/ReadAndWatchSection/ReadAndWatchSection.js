/* eslint-disable react/jsx-props-no-spreading */
import './ReadAndWatchSection.scss';
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
import { FIGURES, COLORS, ERROR_MESSAGES } from '../../config/constants';

function ReadAndWatchSection({
  pageSize,
  getDataFromApi,
  CardTemplateComponent,
  isVideo,
  path,
  sectionTitle,
  breakpoints,
  elemPaddings,
  transitionDelay,
  paragraphNoContentText,
  sectionClass,
}) {
  const { S, M, L, XL } = breakpoints;
  const ref = useRef();

  // индекс страницы
  const [pageIndex, setPageIndex] = useState(0);
  // всего возможных страниц при текущем разрешении
  const [totalPages, setTotalPages] = useState(null);
  const [sectionData, setSectionData] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSectionError, setIsSectionError] = useState(false);

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

    getDataFromApi({ limit: loadThreePages, offset })
      .then(({ results, count }) => {
        setTotalPages(Math.ceil(count / pageSize));
        setSectionData(results);
        setIsLoading(false);
      })
      .catch(() => setIsSectionError(true));
  }, [pageSize]);

  function slideBackHandler() {
    setPageIndex((prevIndex) => prevIndex - 1);
  }

  function slideNextHandler(currentItem, newPageIndex) {
    const pagesLoadedNow = ref.current.getNumOfPages();
    const isPenultimatePage =
      pagesLoadedNow - INDEX_ERROR_FOR_PENULTIMATE_PAGE === newPageIndex;
    const isLastPage =
      pagesLoadedNow - INDEX_ERROR_BETWEEN_NUMBER_AND_INDEX === newPageIndex;

    const isNoMoreDataToLoad = pagesLoadedNow === totalPages;
    if (isNoMoreDataToLoad) {
      return;
    }

    // значит произошел скрол вперед + это предпоследняя страница
    if (isPenultimatePage || isLastPage) {
      addNewData()
        .then(({ results }) => {
          setSectionData((previousData) => [...previousData, ...results]);
          setPageIndex((prevIndex) => prevIndex + 1);
        })
        .catch(() => setIsSectionError(true));
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
          // для секции с Видео
          isVideo={isVideo}
          {...item}
        />
      ));

      return cardArray;
    }
    return [];
  }

  function renderSliderSection() {
    if (isSectionError) {
      return (
        <NoDataNotificationBox
          text={ERROR_MESSAGES.generalErrorMessage.title}
          sectionClass="no-data-text_padding-both"
        />
      );
    }

    if (
      !isLoading &&
      !isSectionError &&
      sectionData &&
      sectionData?.length === 0
    ) {
      return (
        <NoDataNotificationBox
          text={paragraphNoContentText}
          sectionClass="no-data-text_padding-both"
        />
      );
    }

    if (!isLoading && totalPages && sectionData) {
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
  isVideo: PropTypes.bool,
};

ReadAndWatchSection.defaultProps = {
  sectionClass: '',
  isVideo: false,
};

export default ReadAndWatchSection;
