import { useContext, useEffect, useState } from 'react';
import { ErrorsContext, PopupsContext } from '../contexts';
import {
  ALL_CATEGORIES_TAG,
  CHOSEN_BY_MENTOR_TAG,
  DELAY_DEBOUNCE,
  ERROR_MESSAGES,
} from '../config/constants';
import useDebounce from './useDebounce';
import { changeCaseOfFirstLetter } from '../utils/utils';
import {
  deselectAllTags,
  deselectOneTag,
  handleCheckboxBehavior,
  selectOneTag,
} from '../utils/filter-tags';
import ageFiltersArray from '../utils/age-filters';

// хук для фильтров/пагинации на странице Places
// частично повторяет хук useFiltrationWithMainCard, но
// в отличие от страниц Articles и Video главная карточка может и не быть в первой выдаче
// из-за этого больше условий и проверок

const useFiltrationForPlaces = ({
  apiGetDataCallback,
  apiGetFiltersCallback,
  apiGetMainCardCallback,
  apiFilterNames,
  userCity,
  pageSize,
  setIsPageError,
}) => {
  const { setError } = useContext(ErrorsContext);
  const { openPopupError } = useContext(PopupsContext);
  // данные
  const [dataToRender, setDataToRender] = useState([]);
  const [filters, setFilters] = useState([]);
  const [ageFilters, setAgeFilters] = useState(ageFiltersArray);

  // главная карточка
  const [mainCard, setMainCard] = useState({});
  const [isMainCardShown, setIsMainCardShown] = useState(false);
  const [isMainCardInFirstResponse, setIsMainCardInFirstResponse] =
    useState(false);
  const isMainCard = !!mainCard.chosen;

  // лоадеры, флаги
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);
  const [isPaginationUsed, setIsPaginationUsed] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isNoFilteredResults, setIsNoFilteredResults] = useState(false);
  const [isFormRecommendationShown, setIsFormRecommendationShown] =
    useState(true);

  // пагинация
  const [totalPages, setTotalPages] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);

  const debounceFiltration = useDebounce(handleFiltration, DELAY_DEBOUNCE);
  const debouncePaginate = useDebounce(getData, DELAY_DEBOUNCE);

  // Первая отрисовка страницы
  useEffect(() => {
    if (isPageLoading && pageSize && userCity) {
      firstPageRender();
    }
  }, [pageSize, isPageLoading, userCity]);

  // Переход по пагинации, страница уже загружена
  useEffect(() => {
    if (!isPageLoading && !isFiltersUsed) {
      const { activeFilters, activeAges, isChosenByMentorFlag } =
        getActiveFilters();

      defineParamsAndGetData({
        activeFilters,
        activeAges,
        isChosenByMentorFlag,
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
    ageFilters,
    mainCard,
    isMainCard,
    isMainCardShown,
    isPageLoading,
    isFiltersUsed,
    isPaginationUsed,
    isNoFilteredResults,
    isFormRecommendationShown,
    totalPages,
    pageIndex,
    changePageIndex,
    changeFilter,
    changeAgeFilter,
    resetStatesAndGetNewData,
  };

  function resetStatesAndGetNewData() {
    setMainCard({});
    setIsMainCardShown(false);
    setIsMainCardInFirstResponse(false);
    setIsNoFilteredResults(false);
    setIsFormRecommendationShown(true);
    firstPageRender();
  }

  // РАБОТА С ПАГИНАЦИЕЙ
  function changePageIndex(value) {
    if (value !== pageIndex) {
      setPageIndex(value);
      setIsPaginationUsed(true);
      if (isMainCard && isMainCardShown) setIsMainCardShown(false);
      if (isFormRecommendationShown) setIsFormRecommendationShown(false);
    }
  }

  // РАБОТА С ФИЛЬТРАМИ
  function getActiveFilters() {
    let activeFilters = filters.filter(
      (category) => category.isActive && category.filter !== ALL_CATEGORIES_TAG
    );

    const isChosenByMentorFlag = activeFilters.some(
      (tag) => tag.filter === CHOSEN_BY_MENTOR_TAG
    );

    if (isChosenByMentorFlag) {
      activeFilters = activeFilters
        .filter((tag) => tag.filter !== CHOSEN_BY_MENTOR_TAG)
        .map((tag) => tag.filter)
        .join(',');
    } else {
      activeFilters = activeFilters.map((tag) => tag.filter).join(',');
    }

    const activeAges = ageFilters
      .filter((age) => age.isActive)
      .map((age) => age.filter)
      .join(',');

    return {
      activeFilters,
      activeAges,
      isChosenByMentorFlag,
    };
  }

  // хэндлер клика по фильтру
  function changeFilter(inputValue, isChecked) {
    if (inputValue === ALL_CATEGORIES_TAG) {
      // нажата кнопка "Все"
      selectOneTag(setFilters, ALL_CATEGORIES_TAG);
      deselectAllTags(setAgeFilters);
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

  // хэндлер клика по фильтру ВОЗРАСТ
  function changeAgeFilter(inputValue, isChecked) {
    handleCheckboxBehavior(setAgeFilters, { inputValue, isChecked });
    if (isMainCard && isMainCardShown) setIsMainCardShown(false);
    // сбрасываем пагинацию
    setPageIndex(0);
    // ставим флажок фильтров
    setIsFiltersUsed(true);
  }

  // функция-фильтратор
  // eslint-disable-next-line consistent-return
  function handleFiltration() {
    if (filters.length && isFiltersUsed) {
      if (isFormRecommendationShown) setIsFormRecommendationShown(false);

      const { activeFilters, activeAges, isChosenByMentorFlag } =
        getActiveFilters();

      defineParamsAndGetData({
        activeFilters,
        activeAges,
        isChosenByMentorFlag,
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

    const fixedLimit =
      pageIndex === 0 &&
      isMainCard &&
      isMainCardInFirstResponse &&
      !isFiltersActive
        ? pageSize + 1 // кнопка ВСЕ и пагинация на 1 страницу, когда есть карточка
        : pageSize;

    const fixedOffset =
      pageIndex > 0 &&
      isMainCard &&
      isMainCardInFirstResponse &&
      !isFiltersActive
        ? offset + 1
        : offset;

    apiGetDataCallback({
      limit: fixedLimit,
      offset: fixedOffset,
      city: userCity,
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
          if (isMainCard && isMainCardInFirstResponse && !isFiltersActive) {
            // при пагинации без фильтров на всех страницах
            // если карточка есть и она в 1 выдаче, то исключаем её из учёта
            setTotalPages(Math.ceil((count - 1) / pageSize));
          } else {
            setTotalPages(Math.ceil(count / pageSize));
          }

          if (pageIndex === 0 && isMainCard && !isFiltersActive) {
            // вернулись на 1 страницу без фильтров и при карточке
            if (isMainCardInFirstResponse) {
              // карточка есть в 1 выдаче - фильтруем
              setDataToRender(() =>
                results.filter((card) => card.id !== mainCard.id)
              );
            } else {
              setDataToRender(results);
            }
            setIsMainCardShown(true);
            setIsFormRecommendationShown(true);
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
      apiGetMainCardCallback({ city: userCity }),
      apiGetDataCallback({
        city: userCity,
        limit: pageSize + 1,
      }),
      apiGetFiltersCallback(),
    ])
      .then(([chosenByMentorCard, { results, count }, tags]) => {
        if (chosenByMentorCard?.chosen) {
          setMainCard(chosenByMentorCard);
          setIsMainCardShown(true);
        }

        if (results.length > 0) {
          // т.к. стейты не успевают обновиться, то передаем напрямую
          definePlaces({
            chosenByMentorCard,
            cards: results,
            totalCards: count,
          });
        } else {
          setDataToRender([]);
        }

        if (tags.length > 0) {
          // т.к. стейты не успевают обновиться, то передаем напрямую
          defineFilters({ tags, isChosenPlace: chosenByMentorCard?.chosen });
        } else {
          setFilters([]);
        }
      })
      .catch(() => setIsPageError(true))
      .finally(() => setIsPageLoading(false));
  }

  // обработка пришедших с сервера фильтров
  function defineFilters({ tags, isChosenPlace }) {
    const filtersArray = tags.map((tag) => ({
      filter: tag?.slug.toLowerCase(),
      name: changeCaseOfFirstLetter(tag?.name),
      isActive: false,
    }));

    const defaultTags = [
      { filter: ALL_CATEGORIES_TAG, name: ALL_CATEGORIES_TAG, isActive: true },
      ...filtersArray,
    ];

    if (isChosenPlace) {
      setFilters([
        {
          filter: ALL_CATEGORIES_TAG,
          name: ALL_CATEGORIES_TAG,
          isActive: true,
        },
        {
          filter: CHOSEN_BY_MENTOR_TAG,
          name: CHOSEN_BY_MENTOR_TAG,
          isActive: false,
        },
        ...filtersArray,
      ]);
    } else {
      setFilters(defaultTags);
    }
  }

  // обработка главной карточки в первом рендере
  function definePlaces({ chosenByMentorCard, cards, totalCards }) {
    const isChosenCard = chosenByMentorCard?.chosen;
    let isOnFirstResponse = false;
    if (isChosenCard) {
      isOnFirstResponse = cards.some(
        (card) => card.id === chosenByMentorCard.id
      );
      setIsMainCardInFirstResponse(isOnFirstResponse);
    }

    if (isChosenCard && isOnFirstResponse) {
      // главная карточка в первой выдаче
      // фильтруем остальные от неё и не учитываем её при формировании страниц
      const filteredCards = cards.filter(
        (card) => card.id !== chosenByMentorCard.id
      );
      setDataToRender(filteredCards);
      setTotalPages(Math.ceil((totalCards - 1) / pageSize));
    } else {
      if (cards.length > pageSize) {
        // главной карточки нет или она не в 1 выдаче
        // подрезаем 1 карточку для ровной сетки
        setDataToRender(cards.slice(0, -1));
      } else {
        setDataToRender(cards);
      }
      setTotalPages(Math.ceil(totalCards / pageSize));
    }
  }

  function defineParamsAndGetData({
    activeFilters,
    activeAges,
    isChosenByMentorFlag,
    apiCallback,
    isFiltersCallback,
  }) {
    if (activeFilters || activeAges || isChosenByMentorFlag) {
      // собираем все возможные фильтры
      const params = {};
      if (activeFilters) {
        params[apiFilterNames.tags] = activeFilters;
      }

      if (activeAges) {
        params[apiFilterNames.ageRestriction] = activeAges;
      }

      if (isChosenByMentorFlag) {
        params[apiFilterNames.chosen] = isChosenByMentorFlag;
      }

      apiCallback({ isFiltersActive: true, params });
    } else {
      // фильтров нет
      if (isFiltersCallback) selectOneTag(setFilters, ALL_CATEGORIES_TAG);
      apiCallback({ isFiltersActive: false });
    }
  }
};

export default useFiltrationForPlaces;
