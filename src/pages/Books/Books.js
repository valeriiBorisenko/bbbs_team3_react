import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import booksPageTexts from './locales/RU';
import { ERROR_MESSAGES } from '../../config/constants';
import { useFiltrationAndPagination, usePageWidth } from '../../hooks';
import {
  getBook,
  getBooksPageData,
  getBooksPageFilter,
} from '../../api/books-page';
import {
  AnimatedPageContainer,
  BasePage,
  CardBook,
  Loader,
  Paginate,
  PopupBook,
  TagsList,
  TitleH1,
} from './index';
import './Books.scss';

const PAGE_SIZE_PAGINATE = {
  small: 8,
  medium: 12,
  default: 16,
};

const MAX_SCREEN_WIDTH = {
  small: 1216,
  medium: 1640,
};

const { headTitle, headDescription, title, textStubNoData } = booksPageTexts;

function Books() {
  // const { setError } = useContext(ErrorsContext);
  // const { openPopupError } = useContext(PopupsContext);

  const { state } = useLocation();
  const searchBookId = state?.id;
  const [searchedBook, setSearchedBook] = useState({});

  // Загрузка данных
  // const [isLoading, setIsLoading] = useState(true);
  // const [isLoadingPaginate, setIsLoadingPaginate] = useState(false);
  // Стейты с данными Книг, Теги
  // const [booksPageData, setBooksPageData] = useState(null);
  // const [categories, setCategories] = useState(null);
  // флаг применения фильтров
  // const [isFiltersUsed, setIsFiltersUsed] = useState(false);
  // Стейты для пагинации
  const pageSize = usePageWidth(MAX_SCREEN_WIDTH, PAGE_SIZE_PAGINATE);
  // const [pageCount, setPageCount] = useState(0);
  // const [pageNumber, setPageNumber] = useState(0);
  // Стейт ошибки
  const [isPageError, setIsPageError] = useState(false);
  const [isBookPopupOpen, setIsBookPopupOpen] = useState(false);

  const openPopupBook = () => {
    setIsBookPopupOpen(true);
  };

  const closePopupBook = () => {
    setIsBookPopupOpen(false);
  };

  const FiltersAndPaginationSettings = {
    apiGetDataCallback: getBooksPageData,
    apiGetFiltersCallback: getBooksPageFilter,
    apiFilterName: 'types',
    pageSize,
    pageErrorSetter: setIsPageError,
  };

  const {
    dataToRender,
    filters,
    isPageLoading,
    isFiltersUsed,
    isPaginationUsed,
    totalPages,
    pageIndex,
    setPageIndex,
    changeFilter,
  } = useFiltrationAndPagination(FiltersAndPaginationSettings);

  // const getActiveTags = () => {
  //   if (categories) {
  //     return categories
  //       .filter((filter) => filter.isActive && filter.filter !== ALL_CATEGORIES)
  //       .map((filter) => filter.filter)
  //       .join(',');
  //   }
  //   return null;
  // };

  // const getBooksData = (activeCategories) => {
  //   const offset = isFiltersUsed ? 0 : pageSize * pageNumber;
  //   const activeTags = activeCategories || getActiveTags();
  //
  //   getBooksPageData({
  //     limit: pageSize,
  //     offset,
  //     types: activeTags,
  //   })
  //     .then(({ results, count }) => {
  //       setPageCount(Math.ceil(count / pageSize));
  //       return results;
  //     })
  //     .then((results) => setBooksPageData(results))
  //     .catch(() => {
  //       if (isFiltersUsed) {
  //         setError(ERROR_MESSAGES.filterErrorMessage);
  //         openPopupError();
  //       } else {
  //         setIsPageError(true);
  //       }
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //       setIsLoadingPaginate(false);
  //       setIsFiltersUsed(false);
  //     });
  // };

  // const getBooksFilter = () => {
  //   getBooksPageFilter()
  //     .then((tags) => {
  //       const categoriesArr = tags.map((tag) => ({
  //         filter: tag?.slug.toLowerCase(),
  //         name: changeCaseOfFirstLetter(tag?.name),
  //         isActive: false,
  //       }));
  //
  //       setCategories([
  //         { filter: ALL_CATEGORIES, name: ALL_CATEGORIES, isActive: true },
  //         ...categoriesArr,
  //       ]);
  //     })
  //     .catch(() => setIsPageError(true));
  // };

  // хэндлер клика по фильтру КАТЕГОРИЯ
  // const changeCategory = (inputValue, isChecked) => {
  //   if (inputValue === ALL_CATEGORIES) {
  //     selectOneTag(setCategories, ALL_CATEGORIES);
  //   } else {
  //     handleCheckboxBehavior(setCategories, { inputValue, isChecked });
  //     deselectOneTag(setCategories, ALL_CATEGORIES);
  //   }
  //   setIsFiltersUsed(true);
  // };

  // функция-фильтратор с использованием АПИ
  // const handleFiltration = () => {
  //   if (categories && isFiltersUsed) {
  //     const activeCategories = getActiveTags();
  //
  //     if (activeCategories.length === 0) {
  //       selectOneTag(setCategories, ALL_CATEGORIES);
  //     }
  //     getBooksData(activeCategories);
  //   }
  // };

  // Откртие попапа при переходе из поиска
  useEffect(() => {
    if (state) {
      getBook(searchBookId)
        .then((book) => {
          setSearchedBook(book);
          openPopupBook();
        })
        .catch(() => setIsPageError(true));
    }
  }, [state]);

  /// Фильтрация с делэем
  // const debounceFiltration = useDebounce(handleFiltration, DELAY_DEBOUNCE);
  // const debouncePaginate = useDebounce(getBooksData, DELAY_DEBOUNCE);
  // useEffect(() => {
  //   if (isFiltersUsed) {
  //     debounceFiltration();
  //   }
  // }, [isFiltersUsed]);

  // Первая отрисовка страницы + переход по страницам пагинации
  // useEffect(() => {
  //   if (isLoading && pageSize) {
  //     getBooksData();
  //     getBooksFilter();
  //   }
  //
  //   if (!isLoading && !isFiltersUsed) {
  //     setIsLoadingPaginate(true);
  //     debouncePaginate();
  //   }
  // }, [pageSize, pageNumber]);

  // глобальный лоадер
  if (isPageLoading) {
    return <Loader isCentered />;
  }

  return (
    <>
      <BasePage headTitle={headTitle} headDescription={headDescription}>
        <section className="books page__section fade-in">
          {renderPageContent()}
        </section>
      </BasePage>
      <PopupBook
        isOpen={isBookPopupOpen}
        onClose={closePopupBook}
        book={searchedBook}
      />
    </>
  );

  function renderPageContent() {
    if (isPageError) {
      return (
        <AnimatedPageContainer
          titleText={ERROR_MESSAGES.generalErrorMessage.title}
        />
      );
    }
    return (
      <>
        <TitleH1 title={title} sectionClass="books__title" />

        {/* рендер фильтров */}
        {filters?.length > 1 && (
          <TagsList
            filterList={filters}
            name="tag"
            handleClick={changeFilter}
          />
        )}

        {/* рендерим книги */}
        {isFiltersUsed ? <Loader isPaginate /> : renderBooksContainer()}
      </>
    );
  }

  function renderBooksContainer() {
    if (!dataToRender && !isPageLoading) {
      return renderAnimatedContainer();
    }
    return (
      <>
        {isPaginationUsed ? (
          <Loader isPaginate />
        ) : (
          <ul className="books__cards cards-grid cards-grid_content_small-cards fade-in">
            {dataToRender.map((books) => (
              <CardBook key={books.id} data={books} sectionClass="scale-in" />
            ))}
          </ul>
        )}
        {totalPages > 1 && (
          <Paginate
            sectionClass="cards-section__pagination"
            pageCount={totalPages}
            value={pageIndex}
            onChange={setPageIndex}
          />
        )}
      </>
    );
  }

  // контейнер заглушки
  function renderAnimatedContainer() {
    return <AnimatedPageContainer titleText={textStubNoData} />;
  }
}

export default Books;
