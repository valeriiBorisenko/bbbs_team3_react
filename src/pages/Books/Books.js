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
  const { state } = useLocation();
  const searchBookId = state?.id;
  const [searchedBook, setSearchedBook] = useState({});

  const pageSize = usePageWidth(MAX_SCREEN_WIDTH, PAGE_SIZE_PAGINATE);
  const [isPageError, setIsPageError] = useState(false);
  const [isBookPopupOpen, setIsBookPopupOpen] = useState(false);

  const openPopupBook = () => {
    setIsBookPopupOpen(true);
  };

  const closePopupBook = () => {
    setIsBookPopupOpen(false);
  };

  // фильтрация и пагинация
  const filtersAndPaginationSettings = {
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
    changePageIndex,
    changeFilter,
  } = useFiltrationAndPagination(filtersAndPaginationSettings);

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

        {renderFilters()}

        {isFiltersUsed ? <Loader isPaginate /> : renderBooksContainer()}
      </>
    );
  }

  function renderFilters() {
    if (filters?.length > 1) {
      return (
        <TagsList
          filterList={filters}
          name="books"
          handleClick={changeFilter}
        />
      );
    }
    return null;
  }

  function renderPagination() {
    if (totalPages > 1) {
      return (
        <Paginate
          sectionClass="cards-section__pagination"
          pageCount={totalPages}
          value={pageIndex}
          onChange={changePageIndex}
        />
      );
    }

    return null;
  }

  function renderBooksContainer() {
    if (!dataToRender.length && !isPageLoading) {
      return renderAnimatedContainer();
    }

    return (
      <>
        {isPaginationUsed ? (
          <Loader isPaginate />
        ) : (
          <ul className="books__cards cards-grid cards-grid_content_small-cards fade-in">
            {dataToRender.map((books) => (
              <li className="scale-in" key={books.id}>
                <CardBook data={books} />
              </li>
            ))}
          </ul>
        )}

        {renderPagination()}
      </>
    );
  }

  // контейнер заглушки, если нет данных
  function renderAnimatedContainer() {
    return <AnimatedPageContainer titleText={textStubNoData} />;
  }
}

export default Books;
