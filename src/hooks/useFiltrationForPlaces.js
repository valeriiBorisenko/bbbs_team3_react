import { useContext, useEffect, useState } from 'react';
import { ErrorsContext, PopupsContext } from '../contexts';
import {
  ALL_CATEGORIES_TAG,
  CHOSEN_BY_MENTOR_TAG,
  DELAY_DEBOUNCE,
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
// много логики из-за главной карточки и неизвестности её появления
// в отличие от страниц Articles и Video она может и не быть в первой выдаче

// первый рендер
// если карточка в первой выдаче, то фильтруем карточку, limit + 1 при пагинации
// иначе отрезаем 1 карточку для ровной сетки, limit + 0 при пагинации

// при фильтрации на ВСЕ или при пагинации на 1 стр. БЕЗ ФИЛЬТРОВ
// если в первой выдаче, то всегда фильтруем карточку, limit + 1
// иначе грузим только по размеру страницы, limit + 0 при пагинации

// если карточки вообще нет
// первый рендер - отрезаем 1 карточку, потом грузим только по размеру страницы

const useFiltrationForPlaces = ({
  apiGetDataCallback,
  apiGetFiltersCallback,
  apiGetMainCardCallback,
  apiFilterNames,
  userCity,
  pageSize,
  setIsPageError,
}) => {
  // eslint-disable-next-line no-unused-vars
  const { setError } = useContext(ErrorsContext);
  // eslint-disable-next-line no-unused-vars
  const { openPopupError } = useContext(PopupsContext);
  // данные
  const [dataToRender, setDataToRender] = useState([]);
  const [filters, setFilters] = useState([]);
  const [ageFilters, setAgeFilters] = useState(ageFiltersArray);

  // главная карточка
  const [mainCard, setMainCard] = useState({});
  const [isMainCardShown, setIsMainCardShown] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isMainCardInFirstResponse, setIsMainCardInFirstResponse] =
    useState(false);
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

  // console.log({ mainCard });
  // console.log(isMainCard);
  // console.log({ isMainCardInFirstResponse });
  // console.log({ dataToRender });

  // Первая отрисовка страницы
  useEffect(() => {
    if (isPageLoading && pageSize) {
      firstPageRender();
    }
  }, [pageSize, isPageLoading]);

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
    totalPages,
    pageIndex,
    changePageIndex,
    changeFilter,
    changeAgeFilter,
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
    if (filters && isFiltersUsed) {
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
    // const offset = isFiltersUsed ? 0 : pageSize * pageIndex;

    console.log({ isFiltersActive });
    console.log(params);
    setIsFiltersUsed(false);

    // большая карточка всегда будет в первой выдаче
    // const fixedLimit =
    //   pageIndex === 0 && isMainCard && !isFiltersActive
    //     ? pageSize + 1
    //     : pageSize;
    //
    // const fixedOffset =
    //   pageIndex > 0 && isMainCard && !isFiltersActive ? offset + 1 : offset;

    // apiGetDataCallback({
    //   limit: fixedLimit,
    //   offset: fixedOffset,
    //   ...params,
    // })
    //   .then(({ results, count }) => {
    //     if (isMainCard && !isFiltersActive) {
    //       setTotalPages(Math.ceil((count - 1) / pageSize));
    //     } else {
    //       setTotalPages(Math.ceil(count / pageSize));
    //     }
    //
    //     if (pageIndex === 0 && isMainCard && !isFiltersActive) {
    //       setIsMainCardShown(true);
    //     } else setDataToRender(results);
    //   })
    //   .catch(() => {
    //     if (isFiltersUsed) {
    //       setError(ERROR_MESSAGES.filterErrorMessage);
    //       openPopupError();
    //     } else {
    //       setIsPageError(true);
    //     }
    //   })
    //   .finally(() => {
    //     setIsPaginationUsed(false);
    //     setIsFiltersUsed(false);
    //   });
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
        // т.к. стейты не успевают обновиться, то передаем напрямую
        definePlaces({ chosenByMentorCard, cards: results, totalCards: count });
        defineFilters({ tags, isChosenPlace: chosenByMentorCard?.chosen });
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
    } else setFilters(defaultTags);
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
    } else if (isChosenCard && cards.length > pageSize) {
      // не в первой выдаче, но она всё-таки есть
      // подрезаем 1 карточку для ровной сетки
      setDataToRender(cards.slice(0, -1));
      setTotalPages(Math.ceil(totalCards / pageSize));
    } else {
      // главной карточки нет
      setDataToRender(cards);
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
      const params = { city: userCity };
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
