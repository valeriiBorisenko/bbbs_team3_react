import { useContext, useEffect, useState } from 'react';
import { ErrorsContext, PopupsContext } from '../contexts';
import {
  ALL_CATEGORIES_TAG,
  DELAY_DEBOUNCE,
  ERROR_MESSAGES,
  months,
} from '../config/constants';
import useDebounce from './useDebounce';
import { changeCaseOfFirstLetter } from '../utils/utils';
import {
  deselectOneTag,
  handleCheckboxBehavior,
  selectOneTag,
} from '../utils/filter-tags';

// обычный хук фильтрации/пагинации для большинства страниц проекта

const useFiltrationAndPagination = ({
  apiGetDataCallback,
  apiGetFiltersCallback,
  apiFilterNames,
  pageSize,
  setIsPageError,
  isCalendarPage, // особое формирование списка фильтров
  startByFlag, // данные загружаются по какому-либо флагу, он воспринимается как булева, по умолчанию false
}) => {
  const { setError } = useContext(ErrorsContext);
  const { openPopupError } = useContext(PopupsContext);
  // данные
  const [dataToRender, setDataToRender] = useState([]);
  const [filters, setFilters] = useState([]);
  // лоадеры, флаги
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);
  const [isPaginationUsed, setIsPaginationUsed] = useState(false);
  // по факту запускает всю цепочку скриптов
  const [isPageLoading, setIsPageLoading] = useState(!startByFlag);
  // пагинация
  const [totalPages, setTotalPages] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const isNoFilters = !apiGetFiltersCallback;

  const debounceFiltration = useDebounce(handleFiltration, DELAY_DEBOUNCE);
  const debouncePaginate = useDebounce(getData, DELAY_DEBOUNCE);

  // Первая отрисовка страницы
  useEffect(() => {
    if (isPageLoading && pageSize && !startByFlag) {
      if (isNoFilters) firstPageRenderNoFilters();
      else firstPageRender();
    }
  }, [pageSize, isPageLoading]);

  // Переход по пагинации, страница уже загружена
  useEffect(() => {
    if (!isPageLoading && !isFiltersUsed && !startByFlag) {
      const activeFilters = getActiveFilters();

      defineParamsAndGetData({
        activeFilters,
        apiCallback: debouncePaginate,
        isFiltersCallback: false,
      });
    }
  }, [pageSize, pageIndex]);

  // Фильтры, страница уже загружена
  useEffect(() => {
    if (!isPageLoading && isFiltersUsed) {
      debounceFiltration();
    }
  }, [isFiltersUsed]);

  // слушатель разрешения запуска скриптов
  useEffect(() => {
    if (!startByFlag) {
      setIsPageLoading(true);
    }
  }, [startByFlag]);

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
    getActiveFilters,
    firstPageRender, // для повторной загрузки всех данных (при смене города, например)
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
    return filters
      .filter((f) => f.isActive && f.filter !== ALL_CATEGORIES_TAG)
      .map((f) => f.filter)
      .join(',');
  }

  // хэндлер клика по фильтру
  function changeFilter(inputValue, isChecked) {
    if (inputValue === ALL_CATEGORIES_TAG) {
      // кнопка "Все", если она уже нажата, то ничего не делаем
      const isAllAlreadyActive = filters.some(
        (f) => f.isActive && f.filter === ALL_CATEGORIES_TAG
      );
      if (!isAllAlreadyActive) {
        selectOneTag(setFilters, ALL_CATEGORIES_TAG);
        // сбрасываем пагинацию
        setPageIndex(0);
        // ставим флажок фильтров
        setIsFiltersUsed(true);
      }
    } else {
      handleCheckboxBehavior(setFilters, { inputValue, isChecked });
      deselectOneTag(setFilters, ALL_CATEGORIES_TAG);
      setPageIndex(0);
      setIsFiltersUsed(true);
    }
  }

  // функция-фильтратор
  // eslint-disable-next-line consistent-return
  function handleFiltration() {
    if (filters.length && isFiltersUsed) {
      const activeFilters = getActiveFilters();

      defineParamsAndGetData({
        activeFilters,
        apiCallback: getData,
        isFiltersCallback: true,
      });
    }
  }

  function defineFilters(tags) {
    let filtersArray;
    if (isCalendarPage) {
      filtersArray = tags.map((tag) => {
        const filterName = changeCaseOfFirstLetter(months[tag - 1]); // бэк считает с 1, у нас массив с 0
        return {
          filter: tag,
          name: filterName,
          isActive: false,
        };
      });
    } else {
      filtersArray = tags.map((tag) => ({
        filter: tag?.slug.toLowerCase(),
        name: changeCaseOfFirstLetter(tag?.name),
        isActive: false,
      }));
    }

    return setFilters([
      { filter: ALL_CATEGORIES_TAG, name: ALL_CATEGORIES_TAG, isActive: true },
      ...filtersArray,
    ]);
  }

  // РАБОТА С API
  function getData({ params }) {
    const offset = isFiltersUsed ? 0 : pageSize * pageIndex;

    apiGetDataCallback({ limit: pageSize, offset, ...params })
      .then(({ results, count }) => {
        if (results.length > 0) {
          setDataToRender(results);
          setTotalPages(Math.ceil(count / pageSize));
        } else if (results.length === 0 && count > 0) {
          // если count > 0 при пустом массиве, значит мы забегаем вперед по офсету
          // откатываемся на предыдущую страницу
          // возможно при ресайзах экрана
          setPageIndex(pageIndex - 1);
        } else {
          setDataToRender([]);
        }
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
        if (tags.length > 0) {
          defineFilters(tags);
        } else {
          setFilters([]);
        }

        if (results.length > 0) {
          setDataToRender(results);
          setTotalPages(Math.ceil(count / pageSize));
        } else {
          setDataToRender([]);
        }
      })
      .catch(() => setIsPageError(true))
      .finally(() => setIsPageLoading(false));
  }

  function firstPageRenderNoFilters() {
    apiGetDataCallback({ limit: pageSize })
      .then(({ results, count }) => {
        if (results.length > 0) {
          setDataToRender(results);
          setTotalPages(Math.ceil(count / pageSize));
        } else {
          setDataToRender([]);
        }
      })
      .catch(() => setIsPageError(true))
      .finally(() => setIsPageLoading(false));
  }

  function defineParamsAndGetData({
    activeFilters,
    apiCallback,
    isFiltersCallback,
  }) {
    if (activeFilters) {
      const params = {
        [apiFilterNames.tags]: activeFilters,
      };
      apiCallback({ params });
    } else {
      if (isFiltersCallback) selectOneTag(setFilters, ALL_CATEGORIES_TAG);
      apiCallback({});
    }
  }
};

export default useFiltrationAndPagination;
