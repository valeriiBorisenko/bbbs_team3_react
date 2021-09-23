import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import articlesPageTexts from './locales/RU';
import {
  COLORS,
  ERROR_MESSAGES,
  localStChosenArticle,
} from '../../config/constants';
import {
  AnimatedPageContainer,
  BasePage,
  CardArticle,
  Loader,
  Paginate,
  TitleH1,
} from './index';
import { getArticle, getArticlesPageData } from '../../api/articles-page';
import { setLocalStorageData } from '../../hooks/useLocalStorage';
import { PopupsContext } from '../../contexts';
import './Articles.scss';

const PAGE_SIZE_PAGINATE = {
  small: 8,
  big: 12,
};

const smallQueryWidth = '1024px';

const { headTitle, headDescription, title, textStubNoData } = articlesPageTexts;

function Articles() {
  const [pageSize, setPageSize] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  const [articlesPageData, setArticlesPageData] = useState(null);
  const [mainArticle, setMainCard] = useState(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isLoadingPaginate, setIsLoadingPaginate] = useState(false);
  // Стейт ошибки
  const [isPageError, setIsPageError] = useState(false);

  const { state } = useLocation();
  const searchArticleId = state?.id;
  const { openPopupArticle } = useContext(PopupsContext);

  const getPageData = () => {
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
  };

  // Открытие попапа при переходе из поиска
  useEffect(() => {
    if (state) {
      getArticle(searchArticleId)
        .then((res) => {
          setLocalStorageData(localStChosenArticle, res);
          openPopupArticle();
        })
        .catch(() => setIsPageError(true));
    }
  }, [state]);

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
    const smallQuery = window.matchMedia(`(max-width: ${smallQueryWidth})`);

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

  function renderPageContent() {
    if (isPageError) {
      return (
        <AnimatedPageContainer
          titleText={ERROR_MESSAGES.generalErrorMessage.title}
        />
      );
    }

    return (
      <section className="articles page__section">
        <TitleH1 title={title} sectionClass="fade-in" />

        {isLoadingPaginate ? <Loader isPaginate /> : renderCards()}

        {renderPagination()}
      </section>
    );
  }

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
}

export default Articles;
