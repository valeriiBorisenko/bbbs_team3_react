import './Articles.scss';
import { useEffect, useState } from 'react';
import articlesPageTexts from '../../locales/articles-page-RU';
import { useScrollToTop } from '../../hooks/index';
import { COLORS, ERROR_MESSAGES } from '../../config/constants';
import {
  BasePage,
  TitleH1,
  CardArticle,
  Paginate,
  AnimatedPageContainer,
  Loader,
} from './index';
import getArticlesPageData from '../../api/articles-page';

const PAGE_SIZE_PAGINATE = {
  small: 2,
  big: 12,
};

const { headTitle, headDescription, title, textStubNoData } = articlesPageTexts;

function Articles() {
  useScrollToTop();

  const [pageSize, setPageSize] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  const [articlesPageData, setArticlesPageData] = useState(null);
  const [mainArticle, setMainCard] = useState(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isLoadingPaginate, setIsLoadingPaginate] = useState(false);
  // Стейт ошибки
  const [isPageError, setIsPageError] = useState(false);

  function getPageData() {
    const offset = pageSize * pageNumber;
    const fixedPageSize =
      pageNumber === 0 && mainArticle ? pageSize + 1 : pageSize;
    const fixedOffset = pageNumber > 0 && mainArticle ? offset + 1 : offset;

    getArticlesPageData({ limit: fixedPageSize, offset: fixedOffset })
      .then(({ results }) => {
        if (pageNumber === 0 && mainArticle) {
          setArticlesPageData(() =>
            results.filter((item) => !item?.pinnedFullSize)
          );
        } else setArticlesPageData(results);
      })
      .catch(() => setIsPageError(true))
      .finally(() => {
        setIsLoadingPaginate(false);
      });
  }

  // пагинация
  useEffect(() => {
    if (!isLoadingPage) {
      setIsLoadingPaginate(true);
      getPageData();
    }
  }, [pageNumber]);

  useEffect(() => {
    if (pageSize) {
      getArticlesPageData({ limit: pageSize + 1 })
        .then(({ results, count }) => {
          const articlesData = results;
          const mainCard = articlesData.find((item) => item?.pinnedFullSize);
          setMainCard(mainCard);
          if (mainCard) {
            setArticlesPageData(() =>
              articlesData.filter((item) => !item?.pinnedFullSize)
            );
            setPageCount(Math.ceil((count - 1) / pageSize));
          } else {
            articlesData.pop();
            setArticlesPageData(articlesData);
            setPageCount(Math.ceil(count / pageSize));
          }
        })
        .catch(() => {
          setIsPageError(true);
        })
        .finally(() => {
          setIsLoadingPage(false);
        });
    }
  }, [pageSize]);

  useEffect(() => {
    const smallQuery = window.matchMedia('(max-width: 1024px)');

    const listener = () => {
      if (smallQuery.matches) {
        setPageSize(PAGE_SIZE_PAGINATE.small);
      } else {
        setPageSize(PAGE_SIZE_PAGINATE.big);
      }
    };
    listener();

    smallQuery.addEventListener('change', listener);

    return () => {
      smallQuery.removeEventListener('change', listener);
    };
  }, []);

  // отрисовка заглушки
  function renderAnimatedContainer() {
    if (isPageError) {
      return (
        <AnimatedPageContainer
          titleText={ERROR_MESSAGES.generalErrorMessage.title}
        />
      );
    }
    return <AnimatedPageContainer titleText={textStubNoData} />;
  }

  function renderPagination() {
    if (pageCount > 1) {
      return (
        <Paginate
          sectionClass="cards-section__pagination"
          pageCount={pageCount}
          value={pageNumber}
          onChange={setPageNumber}
        />
      );
    }
    return null;
  }

  function renderCards() {
    return (
      <>
        {mainArticle && !pageNumber && (
          <section className="articles__main scale-in">
            <CardArticle data={mainArticle} isMain />
          </section>
        )}

        <section className="articles__cards-grid">
          {articlesPageData.map((item, i) => (
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

  function renderPageContent() {
    return (
      <section className="articles page__section">
        <TitleH1 title={title} sectionClass="fade-in" />

        {isLoadingPaginate ? <Loader isNested /> : renderCards()}

        {renderPagination()}
      </section>
    );
  }

  if (isLoadingPage) {
    return <Loader isCentered />;
  }

  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      {!articlesPageData && !isLoadingPage
        ? renderAnimatedContainer()
        : renderPageContent()}
    </BasePage>
  );
}

export default Articles;
