import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Carousel from 'react-elastic-carousel';
import {
  INDEX_ERROR_BETWEEN_NUMBER_AND_INDEX,
  INDEX_ERROR_FOR_PENULTIMATE_PAGE,
  PAGES_TO_LOAD,
} from './constants';
import { refineClassNames } from '../../utils/utils';
import {
  Heading,
  LinkableComponent,
  Loader,
  NoDataNotificationBox,
} from '../utils';
import { COLORS, ERROR_MESSAGES, FIGURES } from '../../config/constants';
import './ReadAndWatchSection.scss';

function ReadAndWatchSection({
  pageSize,
  getDataFromApi,
  CardTemplateComponent,
  isVideo,
  isSmallQuery,
  path,
  sectionTitle,
  breakpoints,
  elemPaddings,
  transitionDelay,
  paragraphNoContentText,
  sectionClass,
}) {
  const { small, medium, big, large } = breakpoints;
  const ref = useRef();

  // индекс страницы
  const [pageIndex, setPageIndex] = useState(0);
  // всего возможных страниц при текущем разрешении
  const [totalPages, setTotalPages] = useState(null);
  const [sectionData, setSectionData] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSectionError, setIsSectionError] = useState(false);

  const breakPoints = [
    { width: small, itemsToShow: pageSize, itemsToScroll: pageSize },
    { width: medium, itemsToShow: pageSize, itemsToScroll: pageSize },
    { width: big, itemsToShow: pageSize, itemsToScroll: pageSize },
    { width: large, itemsToShow: pageSize, itemsToScroll: pageSize },
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

  const classNames = {
    sliderContainer: refineClassNames([
      'readwatch__slider-container',
      sectionClass,
    ]),
  };

  return (
    <section className="readwatch__section">
      <div className="readwatch__container">
        <LinkableComponent
          content={sectionTitle}
          path={path}
          sectionClass="readwatch__heading"
          linkSectionClass="readwatch__heading-link"
          Component={Heading}
        />
      </div>
      <div className={classNames.sliderContainer}>{renderSliderSection()}</div>
    </section>
  );

  function renderCardsForSlider() {
    if (sectionData) {
      return sectionData.map((item, i) => (
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
          isMobile={isSmallQuery}
          {...item}
        />
      ));
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
          className="readwatch__carousel"
          transitionMs={transitionDelay}
          pagination={false}
          outerSpacing={0}
          itemPadding={elemPaddings}
          breakPoints={breakPoints}
          disableArrowsOnEnd
          showEmptySlots
          onNextEnd={slideNextHandler}
          onPrevEnd={slideBackHandler}
          enableMouseSwipe={false}
        >
          {renderCardsForSlider()}
        </Carousel>
      );
    }

    return <Loader isNested />;
  }
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
  isSmallQuery: PropTypes.bool,
};

ReadAndWatchSection.defaultProps = {
  sectionClass: '',
  isVideo: false,
  isSmallQuery: false,
};

export default ReadAndWatchSection;
