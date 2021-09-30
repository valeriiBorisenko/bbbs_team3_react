import { useState } from 'react';
import { useParams } from 'react-router-dom';
import articlesPageTexts from './locales/RU';
import { COLORS, ERROR_MESSAGES } from '../../config/constants';
import { ARTICLES_URL } from '../../config/routes';
import {
  useFiltrationWithMainCard,
  usePageWidth,
  useSingleCardAtDynamicRoute,
} from '../../hooks';
import { getArticleById, getArticlesPageData } from '../../api/articles-page';
import {
  AnimatedPageContainer,
  BasePage,
  Card,
  CardArticle,
  Loader,
  NextArticleLink,
  Paginate,
  TitleH1,
} from './index';
import './Articles.scss';

const PAGE_SIZE_PAGINATE = {
  small: 8,
  default: 12,
};

const MAX_SCREEN_WIDTH = {
  small: 1024,
};

const { headTitle, headDescription, title, textStubNoData } = articlesPageTexts;

function Articles() {
  const { articleId } = useParams();

  // определяет размер страницы при ресайзе
   const { pageSize } = usePageWidth(MAX_SCREEN_WIDTH, PAGE_SIZE_PAGINATE);
  // стейт ошибки
  const [isPageError, setIsPageError] = useState(false);

  // одиночная карточка при переходе по динамическому маршруту
  const { singleCard, isSingleCardShown } = useSingleCardAtDynamicRoute({
    apiCallback: getArticleById,
    dynamicParam: articleId,
    setIsPageError,
  });

  // фильтрация и пагинация
  const filtersAndPaginationSettings = {
    apiGetDataCallback: getArticlesPageData,
    pageSize,
    setIsPageError,
    dontStartWhileTrue: !!articleId, // скрипты выполнятся, только если нет запроса по id
  };

  const {
    dataToRender,
    mainCard,
    isMainCard,
    isMainCardShown,
    isPageLoading,
    isPaginationUsed,
    totalPages,
    pageIndex,
    changePageIndex,
  } = useFiltrationWithMainCard(filtersAndPaginationSettings);

  // обычная загрузка или есть переход по id, но статья ещё не загружена
  if (isPageLoading || (articleId && !isSingleCardShown)) {
    return <Loader isCentered />;
  }

  return (
    <>
      <BasePage headTitle={headTitle} headDescription={headDescription}>
        {renderPageContent()}
      </BasePage>
    </>
  );

  function renderPageContent() {
    // ошибка или (нет данных и при этом это не динамический роут)
    if (isPageError || (!dataToRender.length && !isMainCard && !articleId)) {
      return renderAnimatedContainer();
    }

    return (
      <section className="articles page__section">
        <TitleH1 title={title} sectionClass="fade-in" />

        {renderCardsContainer()}
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

  function renderCardsContainer() {
    if (isSingleCardShown) {
      return (
        <div className="articles__single-card-container scale-in">
          <CardArticle data={singleCard} isMain />

          <Card sectionClass="articles__single-card-paragraph">
            <p className="paragraph">{singleCard.annotation}</p>
          </Card>

          <NextArticleLink
            text={`Все ${title.toLowerCase()}`}
            href={ARTICLES_URL}
          />
        </div>
      );
    }

    return (
      <>
        {renderCards()}
        {renderPagination()}
      </>
    );
  }

  function renderCards() {
    if (isPaginationUsed) {
      return <Loader isPaginate />;
    }

    return (
      <>
        {isMainCardShown && (
          <section className="articles__main scale-in">
            <CardArticle data={mainCard} isMain />
          </section>
        )}

        <section className="articles__cards-grid">
          {dataToRender.map((item, i) => (
            <CardArticle
              key={item?.id}
              color={COLORS[(i + 1) % COLORS.length]}
              data={item}
              sectionClass="scale-in"
            />
          ))}
        </section>
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

export default Articles;
