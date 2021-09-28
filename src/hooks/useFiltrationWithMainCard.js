import { useContext, useEffect, useState } from 'react';
import { CurrentUserContext, ErrorsContext, PopupsContext } from '../contexts';
import {
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
// в первой выдаче имеется главная карточка, поэтому запрос на 1 карточку больше
// в дальнейшем её не учитываем при формировании страниц
// если карточки не оказалось, то приходится подрезать первую выдачу на 1 карточку для сохранения сетки

const useFiltrationWithMainCard = ({
  apiGetDataCallback,
  apiGetFiltersCallback,
  apiFilterNames,
  pageSize,
  setIsPageError,
  isVideoPage,
}) => {
  const { setError } = useContext(ErrorsContext);
  const { openPopupError } = useContext(PopupsContext);
  const currentUser = useContext(CurrentUserContext);
  // данные
  const [dataToRender, setDataToRender] = useState([]);
  const [filters, setFilters] = useState([]);

  // главная карточка
  const [mainCard, setMainCard] = useState({});
  const [isMainCardShown, setIsMainCardShown] = useState(false);
  const isMainCard = !!mainCard.pinnedFullSize;

  // лоадеры, флаги
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);
  const [isPaginationUsed, setIsPaginationUsed] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isNoFilteredResults, setIsNoFilteredResults] = useState(false);
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
  }, [pageSize, isPageLoading]);

  // перезапуск страницы, если залогинился/разлогинился, т.к. есть отличия в выдаче
  if (isVideoPage) {
    useEffect(() => {
      setIsPageLoading(true);
    }, [currentUser]);
  }

  // Переход по пагинации, страница уже загружена
  useEffect(() => {
    if (!isPageLoading && !isFiltersUsed) {
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

  return {
    dataToRender,
    filters,
    mainCard,
    isMainCard,
    isMainCardShown,
    isPageLoading,
    isFiltersUsed,
    isPaginationUsed,
    isNoFilteredResults,
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
      if (isMainCard && isMainCardShown) setIsMainCardShown(false);
    }
  }

  // РАБОТА С ФИЛЬТРАМИ
  function getActiveFilters() {
    let activeFilters = filters.filter(
      (f) => f.isActive && f.filter !== ALL_CATEGORIES_TAG
    );

    if (isVideoPage) {
      const isResourceGroupSelected = activeFilters.some(
        (tag) => tag.filter === RESOURCE_GROUP_TAG
      );

      if (!isResourceGroupSelected) {
        activeFilters = activeFilters.map((f) => f.filter).join(',');
      } else {
        activeFilters = activeFilters
          .filter((tag) => tag.filter !== RESOURCE_GROUP_TAG)
          .map((f) => f.filter)
          .join(',');
      }

      return { activeFilters, isResourceGroupSelected };
    }

    activeFilters = activeFilters.map((f) => f.filter).join(',');
    return { activeFilters };
  }

  // хэндлер клика по фильтру
  function changeFilter(inputValue, isChecked) {
    if (inputValue === ALL_CATEGORIES_TAG) {
      // нажата кнопка "Все"
      selectOneTag(setFilters, ALL_CATEGORIES_TAG);
      if (isMainCard) setIsMainCardShown(true);
    } else {
      handleCheckboxBehavior(setFilters, { inputValue, isChecked });
      deselectOneTag(setFilters, ALL_CATEGORIES_TAG);
      if (isMainCard && isMainCardShown) setIsMainCardShown(false);
    }
    // сбрасываем пагинацию
    setPageIndex(0);
    // ставим флажок фильтров
    setIsFiltersUsed(true);
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

  // РАБОТА С API
  function getData({ isFiltersActive, params }) {
    // isFiltersUsed учитывает кнопку ВСЕ
    // isFiltersActive - только активные
    const offset = isFiltersUsed ? 0 : pageSize * pageIndex;

    // большая карточка всегда будет в первой выдаче
    const fixedLimit =
      pageIndex === 0 && isMainCard && !isFiltersActive
        ? pageSize + 1 // кнопка ВСЕ и пагинация на 1 страницу, когда есть карточка
        : pageSize;

    const fixedOffset =
      pageIndex > 0 && isMainCard && !isFiltersActive ? offset + 1 : offset;

    apiGetDataCallback({
      limit: fixedLimit,
      offset: fixedOffset,
      ...params,
    })
      .then(({ results, count }) => {
        if (results.length === 0 && count === 0) {
          // показывать нечего
          setIsNoFilteredResults(true);
          setDataToRender([]);
        } else if (results.length === 0 && count > 0) {
          // если count > 0 при пустом массиве, значит мы забегаем вперед по офсету
          // откатываемся на предыдущую страницу
          // возможно при ресайзах экрана
          setPageIndex(pageIndex - 1);
        } else {
          if (isMainCard && !isFiltersActive) {
            // при пагинации без фильтров на всех страницах
            // если карточка есть, то исключаем её из учёта
            setTotalPages(Math.ceil((count - 1) / pageSize));
          } else {
            setTotalPages(Math.ceil(count / pageSize));
          }

          if (pageIndex === 0 && isMainCard && !isFiltersActive) {
            // вернулись на 1 страницу без фильтров и при карточке
            setDataToRender(() =>
              results.filter((item) => !item?.pinnedFullSize)
            );
            setIsMainCardShown(true);
          } else {
            setDataToRender(results);
          }
          if (isNoFilteredResults) setIsNoFilteredResults(false);
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
      apiGetDataCallback({ limit: pageSize + 1 }),
    ])
      .then(([tags, { results, count }]) => {
        if (results.length > 0) {
          handleMainCard({ results, count });
        } else {
          setDataToRender([]);
        }

        if (tags.length > 0) {
          defineFilters(tags);
        } else {
          setFilters([]);
        }
      })
      .catch(() => setIsPageError(true))
      .finally(() => setIsPageLoading(false));
  }

  function firstPageRenderNoFilters() {
    apiGetDataCallback({ limit: pageSize + 1 })
      .then(({ results, count }) => {
        if (results.length > 0) {
          handleMainCard({ results, count });
        } else {
          setDataToRender([]);
        }
      })
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

    if (isVideoPage && currentUser) {
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
  }

  // обработка главной карточки
  function handleMainCard({ results, count }) {
    const pinnedFullSizeCard = results.find((item) => item.pinnedFullSize);
    if (pinnedFullSizeCard) {
      setMainCard(pinnedFullSizeCard);
      setIsMainCardShown(true);
      const filteredCards = results.filter((item) => !item.pinnedFullSize);
      setDataToRender(filteredCards);
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

  function defineParamsAndGetData({
    activeFilters,
    apiCallback,
    isFiltersCallback,
  }) {
    if (activeFilters.activeFilters || activeFilters.isResourceGroupSelected) {
      // собираем все возможные фильтры
      const params = {};
      if (activeFilters.activeFilters) {
        params[apiFilterNames.tags] = activeFilters.activeFilters;
      }

      if (activeFilters.isResourceGroupSelected) {
        params[apiFilterNames.resourceGroup] =
          activeFilters.isResourceGroupSelected;
      }

      apiCallback({ isFiltersActive: true, params });
    } else {
      // фильтров нет
      if (isFiltersCallback) selectOneTag(setFilters, ALL_CATEGORIES_TAG);
      apiCallback({ isFiltersActive: false });
    }
  }
};

export default useFiltrationWithMainCard;
