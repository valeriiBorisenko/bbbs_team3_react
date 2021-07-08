import React, { useEffect, useState } from 'react';
import './Video.scss';
import videoPageTexts from '../../locales/video-page-RU';
import {
  BasePage,
  Loader,
  TitleH1,
  Paginate,
  CardVideoMain,
  CardFilm,
  AnimatedPageContainer,
} from './index';
import { ALL_CATEGORIES, DELAY_DEBOUNCE } from '../../config/constants';
import { useScrollToTop, useDebounce } from '../../hooks/index';
import {
  renderFilterTags,
  handleCheckboxBehavior,
  selectOneTag,
  deselectOneTag,
} from '../../utils/filter-tags';
import { getVideoPageTags, getVideoPageData } from '../../api/video-page';
import { changeCaseOfFirstLetter, formatDuration } from '../../utils/utils';
import { PopupVideo } from '../../components/Popups/index';

const PAGE_SIZE_PAGINATE = {
  small: 4,
  medium: 9,
  big: 16,
};

const Video = () => {
  useScrollToTop();

  const { headTitle, headDescription, title, textStubNoData } = videoPageTexts;

  // Стейты для пагинации
  const [pageSize, setPageSize] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  // Стейты с данными
  const [mainVideo, setMainVideo] = useState({});
  const [video, setVideo] = useState(null);
  const [categories, setCategories] = useState(null);

  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState({});

  // Стейты состояний
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);
  const [isLoadingPaginate, setIsLoadingPaginate] = useState(false);

  const handleVideoClick = (data) => {
    setIsVideoPopupOpen(true);

    setSelectedVideo({
      ...data,
    });
  };

  const closeAllPopups = () => {
    setIsVideoPopupOpen(false);
  };

  // Функция состояний чекбоксов фильтра
  const changeCategory = (inputValue, isChecked) => {
    if (inputValue === ALL_CATEGORIES) {
      selectOneTag(setCategories, ALL_CATEGORIES);
    } else {
      handleCheckboxBehavior(setCategories, { inputValue, isChecked });
      deselectOneTag(setCategories, ALL_CATEGORIES);
    }
    setIsFiltersUsed(true);
  };

  // Фильтры страницы
  const renderTagsContainer = () => (
    <div className="tags">
      <ul className="tags__list">
        {renderFilterTags(categories, 'checkbox', changeCategory)}
      </ul>
    </div>
  );

  // Карточки с видео страницы
  const renderCards = () => (
    <>
      {video.map((item) => {
        const { hours, minutes, seconds } = formatDuration(item.duration);

        return (
          <CardFilm key={item.id} data={item} onClick={handleVideoClick}>
            {hours > 0 ? (
              <p className="card-film__duration paragraph">{`${hours}:${minutes}:${seconds}`}</p>
            ) : (
              <p className="card-film__duration paragraph">{`${minutes}:${seconds}`}</p>
            )}
          </CardFilm>
        );
      })}
    </>
  );

  // Загрузка карточек при нажатии на пагинацию
  const loadingContentPagination = () =>
    isLoadingPaginate ? (
      <Loader isNested />
    ) : (
      <section className="video__cards cards-grid cards-grid_content_small-cards page__section">
        {renderCards()}
      </section>
    );

  // Контент страницы
  const renderMainContent = () => {
    if (!video && !mainVideo && !isLoadingPage) {
      return <AnimatedPageContainer titleText={textStubNoData} />;
    }

    return (
      <>
        {mainVideo && (
          <section className="video__main-card page__section">
            <CardVideoMain data={mainVideo} onClick={handleVideoClick} />
          </section>
        )}

        {isFiltersUsed ? (
          <Loader isNested />
        ) : (
          <>
            {loadingContentPagination()}

            {pageCount > 1 && (
              <section className="video__cards-paginate">
                <Paginate
                  sectionClass="cards-section__pagination "
                  pageCount={pageCount}
                  value={pageNumber}
                  onChange={setPageNumber}
                  isUseScroll={false}
                />
              </section>
            )}
          </>
        )}
      </>
    );
  };

  // Сортировка значений Тэгов для АПИ
  const getActiveTags = () => {
    if (categories) {
      return categories
        .filter((filter) => filter.isActive && filter.filter !== ALL_CATEGORIES)
        .map((filter) => filter.filter)
        .join(',');
    }
    return null;
  };

  // Функция обработки запроса АПИ с карточками
  const getVideoData = (activeCategories) => {
    const offset = isFiltersUsed ? 0 : pageSize * pageNumber;
    const activeTags = activeCategories || getActiveTags();

    getVideoPageData({
      limit: pageSize,
      offset,
      tags: activeTags,
    })
      .then(({ results, count }) => {
        setPageCount(Math.ceil(count / pageSize));
        return results;
      })
      .then((results) => {
        setVideo(results);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsFiltersUsed(false);
        setIsLoadingPaginate(false);
      });
  };

  // Функция обработки запросов АПИ для первой загрузки страницы
  const getFirstPageData = () => {
    Promise.all([
      getVideoPageTags(),
      getVideoPageData({
        limit: pageSize,
      }),
    ])
      .then(([tags, { results, count }]) => {
        console.log(results);
        setPageCount(Math.ceil(count / pageSize));
        setVideo(results);
        console.log(results);

        const fullSizeVideo = results.filter((item) => item.pinnedFullSize)[0];
        setMainVideo(fullSizeVideo);

        const categoriesArr = tags.map((tag) => ({
          filter: tag?.slug.toLowerCase(),
          name: changeCaseOfFirstLetter(tag?.name),
          isActive: false,
        }));

        setCategories([
          { filter: ALL_CATEGORIES, name: ALL_CATEGORIES, isActive: true },
          ...categoriesArr,
        ]);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoadingPage(false);
      });
  };

  // Функция-фильтратор с использованием АПИ
  const handleFiltration = () => {
    if (categories && isFiltersUsed) {
      const activeCategories = getActiveTags();

      if (activeCategories.length === 0) {
        selectOneTag(setCategories, ALL_CATEGORIES);
      }
      getVideoData(activeCategories);
    }
  };

  // Дэлеи для динамических запросов
  const debounceFiltration = useDebounce(handleFiltration, DELAY_DEBOUNCE);
  const debouncePaginate = useDebounce(getVideoData, DELAY_DEBOUNCE);
  // Динамические фильтры
  useEffect(() => {
    if (isFiltersUsed) {
      debounceFiltration();
    }
  }, [isFiltersUsed]);

  // Загрузка страницы, динамическая пагинация, динамический ресайз
  useEffect(() => {
    if (isLoadingPage && pageSize) {
      getFirstPageData();
    }

    if (!isLoadingPage && !isFiltersUsed) {
      setIsLoadingPaginate(true);
      debouncePaginate();
    }
  }, [pageSize, pageNumber]);

  // Резайз пагинации
  useEffect(() => {
    const smallQuery = window.matchMedia('(max-width: 1399px)');
    const largeQuery = window.matchMedia('(max-width: 1640px)');

    const listener = () => {
      if (smallQuery.matches) {
        setPageSize(PAGE_SIZE_PAGINATE.small);
      } else if (largeQuery.matches) {
        setPageSize(PAGE_SIZE_PAGINATE.medium);
      } else {
        setPageSize(PAGE_SIZE_PAGINATE.big);
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

  // Лоадер при загрузке страницы
  if (isLoadingPage) {
    return <Loader isCentered />;
  }

  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      <section className="lead page__section">
        <TitleH1 title={title} />
        {categories?.length > 1 && !isLoadingPage && renderTagsContainer()}
      </section>

      {renderMainContent()}

      <PopupVideo
        data={selectedVideo}
        onClose={closeAllPopups}
        isOpen={isVideoPopupOpen}
      />
    </BasePage>
  );
};

export default Video;
