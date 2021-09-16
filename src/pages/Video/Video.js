import { useContext, useEffect, useState } from 'react';
import './Video.scss';
import { useHistory } from 'react-router-dom';
import videoPageTexts from '../../locales/video-page-RU';
import {
  AnimatedPageContainer,
  BasePage,
  CardFilm,
  CardVideoMain,
  Loader,
  Paginate,
  TagsList,
  TitleH1,
} from './index';
import {
  ALL_CATEGORIES,
  DELAY_DEBOUNCE,
  ERROR_MESSAGES,
  localStChosenVideo,
} from '../../config/constants';
import {
  CurrentUserContext,
  ErrorsContext,
  PopupsContext,
} from '../../contexts';
import { useDebounce } from '../../hooks';
import {
  deselectOneTag,
  handleCheckboxBehavior,
  selectOneTag,
} from '../../utils/filter-tags';
import {
  getVideoPageData,
  getVideoPageTags,
  getVideo,
} from '../../api/video-page';
import { changeCaseOfFirstLetter } from '../../utils/utils';
import { setLocalStorageData } from '../../hooks/useLocalStorage';

const PAGE_SIZE_PAGINATE = {
  small: 8,
  medium: 12,
  big: 16,
};

const { headTitle, headDescription, title, resourceGroupTag, textStubNoData } =
  videoPageTexts;

const Video = () => {
  // работа с открытием попапа видое при переходе из поиска
  const { location, push } = useHistory();
  const { openPopupVideo } = useContext(PopupsContext);

  const { currentUser } = useContext(CurrentUserContext);
  const { setError } = useContext(ErrorsContext);
  const { openPopupError } = useContext(PopupsContext);

  // Стейты для пагинации
  const [pageSize, setPageSize] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  // Стейты с данными
  const [mainVideo, setMainVideo] = useState({});
  const [video, setVideo] = useState(null);
  const [categories, setCategories] = useState(null);

  // Стейты состояний
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);
  const [isLoadingPaginate, setIsLoadingPaginate] = useState(false);
  const [isShowMainCard, setIsShowMainCard] = useState(true);
  // Стейт ошибки
  const [isPageError, setIsPageError] = useState(false);

  // Функция состояний чекбоксов фильтра
  const changeCategory = (inputValue, isChecked) => {
    if (inputValue === ALL_CATEGORIES) {
      selectOneTag(setCategories, ALL_CATEGORIES);
      setIsShowMainCard(true);
    } else {
      handleCheckboxBehavior(setCategories, { inputValue, isChecked });
      deselectOneTag(setCategories, ALL_CATEGORIES);
      setIsShowMainCard(false);
    }
    setIsFiltersUsed(true);
  };

  // функция, определяющая теги категорий в зависимости от того, есть ли рубрика "Ресурсная группа"
  const defineCategories = (tags) => {
    const categoriesArray = tags.map((tag) => ({
      filter: tag?.slug.toLowerCase(),
      name: changeCaseOfFirstLetter(tag?.name),
      isActive: false,
    }));

    let isResourceGroup = false;

    const tagsWithoutResorceGroup = [
      { filter: ALL_CATEGORIES, name: ALL_CATEGORIES, isActive: true },
      ...categoriesArray,
    ];

    const tagsWithResourseGroup = [
      { filter: ALL_CATEGORIES, name: ALL_CATEGORIES, isActive: true },
      { filter: resourceGroupTag, name: resourceGroupTag, isActive: false },
      ...categoriesArray,
    ];

    if (currentUser) {
      getVideoPageData({
        resource_group: true,
      })
        .then((resourceGroupData) => {
          isResourceGroup = resourceGroupData.count > 0;

          if (isResourceGroup) {
            setCategories(tagsWithResourseGroup);
          }
        })
        .catch(() => setIsPageError(true));
    }

    setCategories(tagsWithoutResorceGroup);
  };

  // Сортировка значений Тэгов для АПИ
  const getActiveTags = () => {
    const activeCategories = categories.filter(
      (filter) => filter.isActive && filter.filter !== ALL_CATEGORIES
    );
    const activeTags = activeCategories
      .filter((tag) => tag.filter !== resourceGroupTag)
      .map((filter) => filter.filter)
      .join(',');

    const isResourceGroup = activeCategories.some(
      (tag) => tag.filter === resourceGroupTag
    );
    return { activeTags, isResourceGroup };
  };

  // Функция обработки запроса АПИ с карточками
  const getVideoData = (params, isFiltersActive) => {
    const offset = isFiltersUsed ? 0 : pageSize * pageNumber;

    const fixedPageSize =
      pageNumber === 0 && mainVideo && !isFiltersActive
        ? pageSize + 1
        : pageSize;

    const fixedOffset =
      pageNumber > 0 && mainVideo && !isFiltersActive ? offset + 1 : offset;

    getVideoPageData({
      limit: fixedPageSize,
      offset: fixedOffset,
      ...params,
    })
      .then(({ results, count }) => {
        if (mainVideo && !isFiltersActive) {
          setPageCount(Math.ceil((count - 1) / pageSize));
        } else {
          setPageCount(Math.ceil(count / pageSize));
        }

        if (pageNumber === 0 && mainVideo && !isFiltersActive) {
          setVideo(() => results.filter((item) => !item?.pinnedFullSize));
          setIsShowMainCard(true);
        } else setVideo(results);
      })
      .catch(() => {
        if (isFiltersUsed) {
          setError({
            title: ERROR_MESSAGES.filterErrorMessage.title,
            button: ERROR_MESSAGES.filterErrorMessage.button,
          });
          openPopupError();
        } else {
          setIsPageError(true);
        }
      })
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
        limit: pageSize + 1,
      }),
    ])
      .then(([tags, { results, count }]) => {
        const videoData = results;
        const mainCard = videoData.find((item) => item?.pinnedFullSize);
        setMainVideo(mainCard);
        if (mainCard) {
          setVideo(() => videoData.filter((item) => !item?.pinnedFullSize));
          setPageCount(Math.ceil((count - 1) / pageSize));
        } else {
          videoData.pop();
          setVideo(videoData);
          setPageCount(Math.ceil(count / pageSize));
        }
        defineCategories(tags);
      })
      .catch(() => setIsPageError(true))
      .finally(() => {
        setIsLoadingPage(false);
      });
  };

  // Функция-фильтратор с использованием АПИ
  const handleFiltration = () => {
    if (categories && isFiltersUsed) {
      const { activeTags, isResourceGroup } = getActiveTags();

      if (!activeTags && !isResourceGroup) {
        selectOneTag(setCategories, ALL_CATEGORIES);
        getVideoData(
          { tags: activeTags, resource_group: isResourceGroup },
          false
        );
      } else
        getVideoData(
          { tags: activeTags, resource_group: isResourceGroup },
          true
        );
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

  // Откртие попапа при переходе из поиска
  useEffect(() => {
    if (location.state) {
      getVideo(location.state.id)
        .then((res) => {
          setLocalStorageData(localStChosenVideo, res);
          openPopupVideo();
        })
        .finally(push('/video', null));
    }
  }, [location.state]);

  // Загрузка страницы, динамическая пагинация, динамический ресайз
  useEffect(() => {
    if (pageSize) {
      getFirstPageData();
    }
  }, [pageSize, currentUser]);

  useEffect(() => {
    if (!isLoadingPage && !isFiltersUsed) {
      setIsLoadingPaginate(true);
      const { activeCategories, isResourceGroup } = getActiveTags();
      const predefinedParams = {
        tags: activeCategories,
        resource_group: isResourceGroup,
      };

      if (activeCategories || isResourceGroup) {
        debouncePaginate(predefinedParams, true);
      } else debouncePaginate(predefinedParams, false);
    }
  }, [pageNumber]);

  // Резайз пагинации
  useEffect(() => {
    const smallQuery = window.matchMedia('(max-width: 1023px)');
    const largeQuery = window.matchMedia('(max-width: 1450px)');

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

  // рендеры
  const renderTagsContainer = () => (
    <TagsList
      filterList={categories}
      name="video"
      handleClick={changeCategory}
    />
  );

  // Загрузка карточек при нажатии на пагинацию
  const loadingContentPagination = () =>
    isLoadingPaginate ? (
      <Loader isPaginate />
    ) : (
      <>
        {mainVideo && isShowMainCard && !pageNumber && (
          <section className="video__main-card page__section scale-in">
            <CardVideoMain data={mainVideo} />
          </section>
        )}

        <section className="video__cards-grid page__section">
          {video &&
            video.map((item) => (
              <CardFilm
                key={item?.id}
                data={item}
                sectionClass="scale-in"
                isVideo
              />
            ))}
        </section>
      </>
    );

  // Контент страницы
  const renderMainContent = () => {
    if (!video && !categories) {
      return <AnimatedPageContainer titleText={textStubNoData} />;
    }

    return (
      <>
        {isFiltersUsed ? (
          <Loader isPaginate />
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
                />
              </section>
            )}
          </>
        )}
      </>
    );
  };

  // Лоадер при загрузке страницы
  if (isLoadingPage) {
    return <Loader isCentered />;
  }

  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      {isPageError ? (
        <AnimatedPageContainer
          titleText={ERROR_MESSAGES.generalErrorMessage.title}
        />
      ) : (
        <>
          <section className="lead page__section">
            <TitleH1 title={title} sectionClass="video__title" />
            {categories?.length > 0 && !isLoadingPage && renderTagsContainer()}
          </section>

          {renderMainContent()}
        </>
      )}
    </BasePage>
  );
};

export default Video;
