import { useContext, useEffect, useState } from 'react';
import { ErrorsContext, PopupsContext } from '../contexts';
import {
  ALL_CATEGORIES,
  ALL_CATEGORIES_TAG,
  DELAY_DEBOUNCE,
  ERROR_MESSAGES,
} from '../config/constants';
import useDebounce from './useDebounce';
import { changeCaseOfFirstLetter } from '../utils/utils';
import {
  deselectOneTag,
  handleCheckboxBehavior,
  selectOneTag,
} from '../utils/filter-tags';

// хук фильтрации/пагинации для большинства страниц проекта

const useFiltrationAndPagination = ({
  apiGetDataCallback,
  apiGetFiltersCallback,
  apiFilterNames,
  pageSize,
  setIsPageError,
}) => {
  const { setError } = useContext(ErrorsContext);
  const { openPopupError } = useContext(PopupsContext);
  // данные
  const [dataToRender, setDataToRender] = useState([]);
  const [filters, setFilters] = useState([]);
  // лоадеры, флаги
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);
  const [isPaginationUsed, setIsPaginationUsed] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  // пагинация
  const [totalPages, setTotalPages] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const isNoFilters = !apiGetFiltersCallback;

  const debounceFiltration = useDebounce(handleFiltration, DELAY_DEBOUNCE);
  const debouncePaginate = useDebounce(getData, DELAY_DEBOUNCE);

  // Первая отрисовка страницы
  useEffect(() => {
    if (isPageLoading && pageSize) {
      if (isNoFilters) firstPageRenderNoFilters();
      else firstPageRender();
    }
  }, [pageSize]);

  // Переход по пагинации, страница уже загружена
  useEffect(() => {
    if (!isPageLoading && !isFiltersUsed) {
      const activeFilters = getActiveFilters();

      defineParamsAndGetData({
        activeTags: activeFilters,
        apiCallback: debouncePaginate,
        isFiltersCallback: false,
      });
    }
  }, [pageSize, pageIndex]);

  // Фильтры, страница уже загружена
  useEffect(() => {
    if (!isPageLoading && isFiltersUsed) {
      console.log('filters used');
      debounceFiltration();
    }
  }, [isFiltersUsed]);

  return {
    dataToRender,
    filters,
    isPageLoading,
    isFiltersUsed,
    isPaginationUsed,
    totalPages,
    pageIndex,
    changePageIndex,
    changeFilter,
  };

  // ПАГИНАЦИЯ
  function changePageIndex(value) {
    if (value !== pageIndex) {
      setPageIndex(value);
      setIsPaginationUsed(true);
    }
  }

  // ФИЛЬТРЫ
  function getActiveFilters() {
    if (filters.length) {
      return filters
        .filter((f) => f.isActive && f.filter !== ALL_CATEGORIES)
        .map((f) => f.filter)
        .join(',');
    }
    return null;
  }

  // хэндлер клика по фильтру
  function changeFilter(inputValue, isChecked) {
    if (inputValue === ALL_CATEGORIES) {
      // кнопка "Все", откат на 1 страницу
      selectOneTag(setFilters, ALL_CATEGORIES);
    } else {
      handleCheckboxBehavior(setFilters, { inputValue, isChecked });
      deselectOneTag(setFilters, ALL_CATEGORIES);
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
      const activeFilters = getActiveFilters();

      defineParamsAndGetData({
        activeTags: activeFilters,
        apiCallback: getData,
        isFiltersCallback: true,
      });
    }
  }

  function defineFilters(tags) {
    const filtersArray = tags.map((tag) => ({
      filter: tag?.slug.toLowerCase(),
      name: changeCaseOfFirstLetter(tag?.name),
      isActive: false,
    }));

    return setFilters([
      { filter: ALL_CATEGORIES_TAG, name: ALL_CATEGORIES_TAG, isActive: true },
      ...filtersArray,
    ]);
  }

  // РАБОТА С API
  function getData({ params }) {
    // const tags = { [apiFilterNames.tags]: getActiveFilters() };
    const offset = isFiltersUsed ? 0 : pageSize * pageIndex;

    apiGetDataCallback({ limit: pageSize, offset, ...params })
      .then(({ results, count }) => {
        setTotalPages(Math.ceil(count / pageSize));
        setDataToRender(results);
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
      apiGetDataCallback({ limit: pageSize }),
    ])
      .then(([tags, { results, count }]) => {
        setTotalPages(Math.ceil(count / pageSize));
        defineFilters(tags);
        setDataToRender(results);
      })
      .catch(() => setIsPageError(true))
      .finally(() => setIsPageLoading(false));
  }

  function firstPageRenderNoFilters() {
    apiGetDataCallback({ limit: pageSize })
      .then(({ results, count }) => {
        setTotalPages(Math.ceil(count / pageSize));
        setDataToRender(results);
      })
      .catch(() => setIsPageError(true))
      .finally(() => setIsPageLoading(false));
  }

  function defineParamsAndGetData({
    activeTags,
    apiCallback,
    isFiltersCallback,
  }) {
    if (activeTags) {
      const params = {
        [apiFilterNames.tags]: activeTags,
      };
      apiCallback({ params });
    } else {
      if (isFiltersCallback) selectOneTag(setFilters, ALL_CATEGORIES);
      apiCallback({});
    }
  }
};

export default useFiltrationAndPagination;
