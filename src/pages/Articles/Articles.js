import './Articles.scss';
import { useEffect, useState } from 'react';
import articlesPageTexts from '../../locales/articles-page-RU';
import { useScrollToTop } from '../../hooks/index';
import { COLORS } from '../../config/constants';
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

  const [articlesPageData, setArticlesPageData] = useState([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isLoadingPaginate, setIsLoadingPaginate] = useState(false);

  function getPageData() {
    const offset = pageSize * pageNumber;
    const fixedPageSize = pageNumber === 0 ? pageSize + 1 : pageSize;
    const fixedOffset = pageNumber > 0 ? offset + 1 : offset;

    getArticlesPageData({ limit: fixedPageSize, offset: fixedOffset })
      .then(({ results, count }) => {
        setArticlesPageData(results);
        setPageCount(Math.ceil(count / pageSize));
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoadingPaginate(false);
        setIsLoadingPage(false);
      });
  }

  useEffect(() => {
    if (pageSize) {
      getPageData();
    }

    if (!isLoadingPage) {
      setIsLoadingPaginate(true);
    }
  }, [pageSize, pageNumber]);

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

  const mainCard = articlesPageData.find((item) => item?.pinnedFullSize);
  const cardsWithoutMain = articlesPageData.filter(
    (item) => !item?.pinnedFullSize
  );

  // отрисовка заглушки
  function renderAnimatedContainer() {
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
        {mainCard && (
          <section className="articles__main fade-in">
            <CardArticle
              data={mainCard}
              // никита, 12.07
              // sectionClass="card-container_type_main-article"
              isMain
            />
          </section>
        )}

        <section className="articles__cards-grid">
          {cardsWithoutMain.map((item, i) => (
            <CardArticle
              key={item.id}
              color={COLORS[(i + 1) % COLORS.length]}
              data={item}
              // никита, 12.07
              // sectionClass="card-container_type_article fade-in"
            />
          ))}
        </section>
      </>
    );
  }

  function renderPageContent() {
    return (
      <section className="articles page__section fade-in">
        <TitleH1 title={title} />

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
