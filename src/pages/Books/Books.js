import { useState } from 'react';
import { useParams } from 'react-router-dom';
import booksPageTexts from './locales/RU';
import { ERROR_MESSAGES } from '../../config/constants';
import { BOOKS_URL } from '../../config/routes';
import {
  useFiltrationAndPagination,
  usePageWidth,
  useSingleCardAtDynamicRoute,
} from '../../hooks';
import {
  getBookById,
  getBooksPageData,
  getBooksPageFilter,
} from '../../api/books-page';
import {
  AnimatedPageContainer,
  BasePage,
  CardBook,
  Loader,
  NextArticleLink,
  Paginate,
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
  const { bookId } = useParams();

  // определяет размер страницы при ресайзе
  const pageSize = usePageWidth(MAX_SCREEN_WIDTH, PAGE_SIZE_PAGINATE);
  // стейт ошибки
  const [isPageError, setIsPageError] = useState(false);

  // одиночная карточка при переходе по динамическому маршруту
  const { singleCard, isSingleCardShown } = useSingleCardAtDynamicRoute({
    apiCallback: getBookById,
    dynamicParam: bookId,
    setIsPageError,
  });

  // фильтрация и пагинация
  const filtersAndPaginationSettings = {
    apiGetDataCallback: getBooksPageData,
    apiGetFiltersCallback: getBooksPageFilter,
    apiFilterNames: {
      tags: 'types',
    },
    pageSize,
    setIsPageError,
    dontStartWhileTrue: !!bookId, // скрипты выполнятся, только если нет запроса книги по id
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

  // обычная загрузка или есть переход по id, но книга ещё не загружена
  if (isPageLoading || (bookId && !isSingleCardShown)) {
    return <Loader isCentered />;
  }

  return (
    <>
      <BasePage
        headTitle={headTitle}
        headDescription={headDescription}
        scrollUpDeps={[bookId]}
      >
        <section className="books page__section fade-in">
          {renderPageContent()}
        </section>
      </BasePage>
    </>
  );

  function renderPageContent() {
    // ошибка или (нет данных и при этом это не динамический роут)
    if (isPageError || (!dataToRender.length && !bookId)) {
      return renderAnimatedContainer();
    }

    return (
      <>
        <TitleH1 title={title} sectionClass="books__title" />
        {renderMainContent()}
      </>
    );
  }

  // заглушка
  function renderAnimatedContainer() {
    return (
      <AnimatedPageContainer
        titleText={
          isPageError
            ? ERROR_MESSAGES.generalErrorMessage.title
            : textStubNoData
        }
      />
    );
  }

  function renderMainContent() {
    if (isSingleCardShown) {
      return (
        <div className="books__single-book-container">
          <CardBook data={singleCard} isOnlyCover sectionClass="scale-in" />

          <p className="paragraph books__paragraph fade-in">
            {singleCard.annotation}
          </p>

          <NextArticleLink
            text={`Все ${title.toLowerCase()}`}
            href={BOOKS_URL}
          />
        </div>
      );
    }

    return (
      <>
        {renderFilters()}
        {isFiltersUsed ? <Loader isPaginate /> : renderBooksContainer()}
      </>
    );
  }

  function renderFilters() {
    // учитываем кнопку ВСЕ
    if (filters.length > 2) {
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

  function renderBooksContainer() {
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
}

export default Books;
