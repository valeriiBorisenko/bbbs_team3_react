import { useState } from 'react';
import rightsPageTexts from './locales/RU';
import { COLORS, ERROR_MESSAGES, FIGURES } from '../../config/constants';
import { useFiltrationAndPagination, usePageWidth } from '../../hooks';
import { getRightsData, getRightsTags } from '../../api/rights-page';
import {
  AnimatedPageContainer,
  BasePage,
  CardRights,
  CardsSectionWithLines,
  Loader,
  TagsList,
  TitleH1,
} from './index';
import './Rights.scss';

const PAGE_SIZE_PAGINATE = {
  small: 4,
  medium: 12,
  default: 16,
};

const MAX_SCREEN_WIDTH = {
  small: 1400,
  medium: 1640,
};

const { headTitle, headDescription, title, textStubNoData } = rightsPageTexts;

const Rights = () => {
  const pageSize = usePageWidth(MAX_SCREEN_WIDTH, PAGE_SIZE_PAGINATE);
  // Стейт ошибки
  const [isPageError, setIsPageError] = useState(false);

  // фильтрация и пагинация
  const filtersAndPaginationSettings = {
    apiGetDataCallback: getRightsData,
    apiGetFiltersCallback: getRightsTags,
    apiFilterNames: {
      tags: 'tags',
    },
    pageSize,
    setIsPageError,
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
    getActiveFilters,
  } = useFiltrationAndPagination(filtersAndPaginationSettings);

  // Лоадер при загрузке страницы
  if (isPageLoading) {
    return <Loader isCentered />;
  }

  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      <section className="rights page__section fade-in">
        {isPageError ? (
          <AnimatedPageContainer
            titleText={ERROR_MESSAGES.generalErrorMessage.title}
          />
        ) : (
          <>
            <TitleH1 title={title} sectionClass="rights__title" />
            {renderTagsContainer()}
            {renderMainContent()}
          </>
        )}
      </section>
    </BasePage>
  );

  // Фильтры страницы
  function renderTagsContainer() {
    if (filters?.length > 1) {
      return (
        <TagsList
          filterList={filters}
          name="rights"
          handleClick={changeFilter}
        />
      );
    }
    return null;
  }

  // Карточки
  function renderCards() {
    return (
      <>
        <CardsSectionWithLines
          pageCount={totalPages}
          pageNumber={pageIndex}
          setPageNumber={changePageIndex}
          isLoading={isPaginationUsed}
          dataLength={dataToRender.length}
          pageSize={pageSize}
        >
          {dataToRender.map((item, i) => (
            <CardRights
              key={item?.id}
              sectionClass="cards-section__item scale-in"
              title={item?.title}
              tags={item?.tags}
              shape={FIGURES[i % FIGURES.length]}
              color={COLORS[i % COLORS.length]}
              id={item?.id}
              getActiveTags={getActiveFilters}
            />
          ))}
        </CardsSectionWithLines>
      </>
    );
  }

  // Контент страницы
  function renderMainContent() {
    if (!dataToRender.length && !isPageLoading) {
      return <AnimatedPageContainer titleText={textStubNoData} />;
    }

    return isFiltersUsed ? <Loader isPaginate /> : renderCards();
  }
};

export default Rights;
