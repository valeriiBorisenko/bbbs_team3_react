import { useContext, useEffect, useState } from 'react';
import { ErrorsContext, PopupsContext } from '../contexts';
import {
  ALL_CATEGORIES,
  ALL_CATEGORIES_TAG,
  DELAY_DEBOUNCE,
  ERROR_MESSAGES,
  RESOURCE_GROUP_TAG,
} from '../config/constants';
import useDebounce from './useDebounce';
import { changeCaseOfFirstLetter } from '../utils/utils';
import {
  deselectOneTag,
  handleCheckboxBehavior,
  selectOneTag,
} from '../utils/filter-tags';

// хук для фильтров/пагинации на страницах Video и Articles
// он сложнее и требует доп. условий

const useFiltrationAndPagination = ({
  apiGetDataCallback,
  apiGetFiltersCallback,
  apiFilterNames,
  pageSize,
  setIsPageError,
  isVideoPage,
  currentUser,
}) => {
  const { setError } = useContext(ErrorsContext);
  const { openPopupError } = useContext(PopupsContext);
  // данные
  const [dataToRender, setDataToRender] = useState([]);
  const [filters, setFilters] = useState([]);

  // главная карточка
  const [mainCard, setMainCard] = useState({});
  const [isMainCardShown, setIsMainCardShown] = useState(false);
  const isMainCard = !!Object.keys(mainCard).length;

  // лоадеры, флаги
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);
  const [isPaginationUsed, setIsPaginationUsed] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  // пагинация
  const [totalPages, setTotalPages] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);

  const debounceFiltration = useDebounce(handleFiltration, DELAY_DEBOUNCE);
  const debouncePaginate = useDebounce(getData, DELAY_DEBOUNCE);

  // Первая отрисовка страницы
  useEffect(() => {
    if (isPageLoading && pageSize) {
      if (apiGetFiltersCallback) {
        firstPageRender();
      } else {
        firstPageRenderNoFilters();
      }
    }
  }, [pageSize, isPageLoading]);

  // перезапуск страницы, если залогинился/разлогинился, т.к. есть отличия в выдаче
  useEffect(() => {
    setIsPageLoading(true);
  }, [currentUser]);

  // Переход по пагинации, страница уже загружена
  useEffect(() => {
    if (!isPageLoading && !isFiltersUsed) {
      const activeTags = getActiveFilters();

      defineParamsAndGetData({
        activeTags,
        apiCallback: debouncePaginate,
        isFilters: false,
      });
    }
  }, [pageSize, pageIndex]);

  // Фильтры, страница уже загружена
  useEffect(() => {
    if (!isPageLoading && isFiltersUsed) {
      debounceFiltration();
    }
  }, [isFiltersUsed]);

  return {
    dataToRender,
    filters,
    mainCard,
    isMainCard,
    isMainCardShown,
    isPageLoading,
    isFiltersUsed,
    isPaginationUsed,
    totalPages,
    pageIndex,
    changePageIndex,
    changeFilter,
  };

  // РАБОТА С ПАГИНАЦИЕЙ
  function changePageIndex(value) {
    if (value !== pageIndex) {
      setPageIndex(value);
      setIsPaginationUsed(true);
      setIsMainCardShown(false);
    }
  }

  // РАБОТА С ФИЛЬТРАМИ
  function getActiveFilters() {
    let activeFilters;
    if (isVideoPage) {
      const activeTags = filters.filter(
        (f) => f.isActive && f.filter !== ALL_CATEGORIES
      );

      const isResourceGroupSelected = activeTags.some(
        (tag) => tag.filter === RESOURCE_GROUP_TAG
      );

      if (!isResourceGroupSelected) {
        activeFilters = activeTags.map((f) => f.filter).join(',');
      } else {
        activeFilters = activeTags
          .filter((tag) => tag.filter !== RESOURCE_GROUP_TAG)
          .map((f) => f.filter)
          .join(',');
      }

      return { activeFilters, isResourceGroupSelected };
    }

    if (filters) {
      activeFilters = filters
        .filter((f) => f.isActive && f.filter !== ALL_CATEGORIES)
        .map((f) => f.filter)
        .join(',');
      return { activeFilters };
    }
    return null;
  }

  // хэндлер клика по фильтру
  function changeFilter(inputValue, isChecked) {
    if (inputValue === ALL_CATEGORIES) {
      // нажата кнопка "Все"
      selectOneTag(setFilters, ALL_CATEGORIES);
      if (isMainCard) setIsMainCardShown(true);
    } else {
      handleCheckboxBehavior(setFilters, { inputValue, isChecked });
      deselectOneTag(setFilters, ALL_CATEGORIES);
      setIsMainCardShown(false);
    }
    // сбрасываем пагинацию
    setPageIndex(0);
    // ставим флажок фильтров
    setIsFiltersUsed(true);
  }

  // функция-фильтратор
  // eslint-disable-next-line consistent-return
  function handleFiltration() {
    if (filters && isFiltersUsed) {
      const activeTags = getActiveFilters();

      defineParamsAndGetData({
        activeTags,
        apiCallback: getData,
        isFilters: true,
      });
    }
  }

  // РАБОТА С API
  function getData({ isFiltersActive, params }) {
    // isFiltersUsed учитывает кнопку ВСЕ
    // isFiltersActive - только активные
    const offset = isFiltersUsed ? 0 : pageSize * pageIndex;

    // большая карточка всегда будет в первой выдаче
    const fixedLimit =
      pageIndex === 0 && isMainCard && !isFiltersActive
        ? pageSize + 1
        : pageSize;

    const fixedOffset =
      pageIndex > 0 && isMainCard && !isFiltersActive ? offset + 1 : offset;

    apiGetDataCallback({
      limit: fixedLimit,
      offset: fixedOffset,
      ...params,
    })
      .then(({ results, count }) => {
        if (isMainCard && !isFiltersActive) {
          setTotalPages(Math.ceil((count - 1) / pageSize));
        } else {
          setTotalPages(Math.ceil(count / pageSize));
        }

        if (pageIndex === 0 && isMainCard && !isFiltersActive) {
          setDataToRender(() =>
            results.filter((item) => !item?.pinnedFullSize)
          );
          setIsMainCardShown(true);
        } else setDataToRender(results);
      })
      .catch(() => {
        if (isFiltersUsed) {
          setError(ERROR_MESSAGES.filterErrorMessage);
          openPopupError();
        } else {
          setIsPageError(true);
        }
      })
      .finally(() => {
        setIsPaginationUsed(false);
        setIsFiltersUsed(false);
      });
  }

  function firstPageRender() {
    Promise.all([
      apiGetFiltersCallback(),
      apiGetDataCallback({ limit: pageSize + 1 }),
    ])
      .then(([tags, { results, count }]) => {
        handleMainCard({ results, count });
        defineFilters(tags);
      })
      .catch(() => setIsPageError(true))
      .finally(() => setIsPageLoading(false));
  }

  function firstPageRenderNoFilters() {
    apiGetDataCallback({ limit: pageSize + 1 })
      .then(({ results, count }) => handleMainCard({ results, count }))
      .catch(() => setIsPageError(true))
      .finally(() => setIsPageLoading(false));
  }

  // обработка пришедших с сервера фильтров
  function defineFilters(tags) {
    const filtersArray = tags.map((tag) => ({
      filter: tag?.slug.toLowerCase(),
      name: changeCaseOfFirstLetter(tag?.name),
      isActive: false,
    }));

    const defaultTags = [
      { filter: ALL_CATEGORIES_TAG, name: ALL_CATEGORIES_TAG, isActive: true },
      ...filtersArray,
    ];

    if (isVideoPage) {
      if (currentUser) {
        // проверка хоть на 1 видео из ресурсной группы
        apiGetDataCallback({
          limit: 1,
          [apiFilterNames.resourceGroup]: true,
        })
          .then((resourceGroupData) => {
            if (resourceGroupData.count > 0) {
              const tagsWithResourceGroup = [
                {
                  filter: ALL_CATEGORIES_TAG,
                  name: ALL_CATEGORIES_TAG,
                  isActive: true,
                },
                {
                  filter: RESOURCE_GROUP_TAG,
                  name: RESOURCE_GROUP_TAG,
                  isActive: false,
                },
                ...filtersArray,
              ];

              setFilters(tagsWithResourceGroup);
            } else {
              setFilters(defaultTags);
            }
          })
          .catch(() => setIsPageError(true));
      } else {
        setFilters(defaultTags);
      }
    } else {
      setFilters(defaultTags);
    }
  }

  function defineParamsAndGetData({ activeTags, apiCallback, isFilters }) {
    if (
      isVideoPage &&
      (activeTags.activeFilters || activeTags.isResourceGroupSelected)
    ) {
      // на видео странице выбран любой из фильтров
      const params = {
        [apiFilterNames.tags]: activeTags.activeFilters,
        [apiFilterNames.resourceGroup]: activeTags.isResourceGroupSelected,
      };
      apiCallback({ isFiltersActive: true, params });
    } else if (!isVideoPage && activeTags.activeFilters) {
      const params = {
        [apiFilterNames.tags]: activeTags.activeFilters,
      };
      apiCallback({ isFiltersActive: true, params });
    } else {
      if (isFilters) selectOneTag(setFilters, ALL_CATEGORIES);
      apiCallback({ isFiltersActive: false });
    }
  }

  // обработка главной карточки
  function handleMainCard({ results, count }) {
    const pinnedFullSizeCard = results.find((item) => item?.pinnedFullSize);
    if (pinnedFullSizeCard) {
      setMainCard(pinnedFullSizeCard);
      setIsMainCardShown(true);
      setDataToRender(results.filter((item) => !item?.pinnedFullSize));
      // не учитываем первую карточку в остальной выдаче
      setTotalPages(Math.ceil((count - 1) / pageSize));
    } else {
      if (results.length > pageSize) {
        setDataToRender(results.slice(0, -1));
      } else {
        setDataToRender(results);
      }
      setTotalPages(Math.ceil(count / pageSize));
    }
  }
};

export default useFiltrationAndPagination;
