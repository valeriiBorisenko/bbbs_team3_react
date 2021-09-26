import { useContext, useEffect, useState } from 'react';
import { ErrorsContext, PopupsContext } from '../contexts';
import {
  ALL_CATEGORIES,
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

// для календаря свои фильтры
// куда пойти - главная карточка + больше фильтров
// статьи и видео - главная карточка

const useFiltrationAndPagination = ({
  apiGetDataCallback,
  apiGetFiltersCallback,
  apiFilterName,
  pageSize,
  pageErrorSetter,
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

  const getActiveFilters = () => {
    if (filters) {
      return filters
        .filter((f) => f.isActive && f.filter !== ALL_CATEGORIES)
        .map((f) => f.filter)
        .join(',');
    }
    return null;
  };

  // работа с API
  const getFilters = () => {
    apiGetFiltersCallback()
      .then((tags) => {
        const filtersArray = tags.map((tag) => ({
          filter: tag?.slug.toLowerCase(),
          name: changeCaseOfFirstLetter(tag?.name),
          isActive: false,
        }));

        setFilters([
          { filter: ALL_CATEGORIES, name: ALL_CATEGORIES, isActive: true },
          ...filtersArray,
        ]);
      })
      .catch(() => pageErrorSetter(true));
  };

  const getData = () => {
    const tags = { [apiFilterName]: getActiveFilters() };
    const offset = isFiltersUsed ? 0 : pageSize * pageIndex;

    apiGetDataCallback({ limit: pageSize, offset, ...tags })
      .then(({ results, count }) => {
        setTotalPages(Math.ceil(count / pageSize));
        setDataToRender(results);
      })
      .catch(() => {
        if (isFiltersUsed) {
          setError(ERROR_MESSAGES.filterErrorMessage);
          openPopupError();
        } else {
          pageErrorSetter(true);
        }
      })
      .finally(() => {
        setIsPageLoading(false);
        setIsPaginationUsed(false);
        setIsFiltersUsed(false);
      });
  };

  // хэндлер клика по фильтру
  const changeFilter = (inputValue, isChecked) => {
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
  };

  // функция-фильтратор с использованием АПИ
  // eslint-disable-next-line consistent-return
  const handleFiltration = () => {
    if (filters && isFiltersUsed) {
      const activeCategories = getActiveFilters();

      if (!activeCategories) {
        selectOneTag(setFilters, ALL_CATEGORIES);
      }

      getData();
    }
  };

  const debounceFiltration = useDebounce(handleFiltration, DELAY_DEBOUNCE);
  const debouncePaginate = useDebounce(getData, DELAY_DEBOUNCE);

  const changePageIndex = (value) => {
    if (value !== pageIndex) {
      setPageIndex(value);
      setIsPaginationUsed(true);
    }
  };

  // Первая отрисовка страницы
  useEffect(() => {
    if (isPageLoading && pageSize) {
      getData();
      getFilters();
    }
  }, [pageSize]);

  // Переход по пагинации, страница уже загружена
  useEffect(() => {
    if (!isPageLoading && !isFiltersUsed) {
      console.log('pagination used');
      debouncePaginate();
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
};

export default useFiltrationAndPagination;
