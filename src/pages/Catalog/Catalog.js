import { useState } from 'react';
import catalogPageTexts from './locales/RU';
import { getCatalogPageData } from '../../api/catalog-page';
import { ERROR_MESSAGES, FIGURES } from '../../config/constants';
import { useFiltrationAndPagination, usePageWidth } from '../../hooks';
import {
  AnimatedPageContainer,
  BasePage,
  CardCatalog,
  CardsSectionWithLines,
  Heading,
  Loader,
} from './index';
import './Catalog.scss';

const PAGE_SIZE_PAGINATE = {
  small: 4,
  medium: 9,
  default: 16,
};

const MAX_SCREEN_WIDTH = {
  small: 1400,
  medium: 1640,
};

const { headTitle, headDescription, title, subtitle, textStubNoData } =
  catalogPageTexts;

function Catalog() {
  // определяет, сколько карточек показывать на странице в зависимости от ширины экрана
  const { pageSize } = usePageWidth(MAX_SCREEN_WIDTH, PAGE_SIZE_PAGINATE);
  // Стейт ошибки
  const [isPageError, setIsPageError] = useState(false);

  // пагинация
  const filtersAndPaginationSettings = {
    apiGetDataCallback: getCatalogPageData,
    pageSize,
    setIsPageError,
  };

  const {
    dataToRender,
    isPageLoading,
    isPaginationUsed,
    totalPages,
    pageIndex,
    changePageIndex,
  } = useFiltrationAndPagination(filtersAndPaginationSettings);

  if (isPageLoading) {
    return <Loader isCentered />;
  }

  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      {renderPageContent()}
    </BasePage>
  );

  function renderPageContent() {
    if (isPageError || !dataToRender.length) {
      return renderAnimatedContainer();
    }

    return (
      <section className="catalog page__section fade-in">
        <Heading
          level={1}
          type="big"
          sectionClass="page__title"
          content={title}
        />
        <Heading
          level={2}
          type="small"
          sectionClass="catalog__subtitle"
          content={subtitle}
        />
        {renderCards()}
      </section>
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

  function renderCards() {
    return (
      <CardsSectionWithLines
        pageCount={totalPages}
        pageNumber={pageIndex}
        setPageNumber={changePageIndex}
        isLoading={isPaginationUsed}
        dataLength={dataToRender.length}
        pageSize={pageSize}
      >
        {dataToRender.map((item, i) => (
          <CardCatalog
            sectionClass="cards-section__item scale-in"
            key={item?.id}
            data={item}
            shape={FIGURES[i % FIGURES.length]}
          />
        ))}
      </CardsSectionWithLines>
    );
  }
}

export default Catalog;
