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
import './Articles.scss';

function Articles() {
  const { headTitle, headDescription, title, animatedContainerText } =
    articlesPageTexts;
  useScrollToTop();

  const [pageSize, setPageSize] = useState(12);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  const [articlesPageData, setArticlesPageData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setIsLoading(true);
    const offset = pageSize * pageNumber;
    const fixedPageSize = pageNumber === 0 ? pageSize + 1 : pageSize;
    const fixedOffset = pageNumber > 0 ? offset + 1 : offset;
    getArticlesPageData({ limit: fixedPageSize, offset: fixedOffset })
      .then(({ results, count }) => {
        setArticlesPageData(results);
        setPageCount(Math.ceil(count / pageSize));
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, [pageSize, pageNumber]);

  useEffect(() => {
    const smallQuery = window.matchMedia('(max-width: 1024px)');

    const listener = () => {
      if (smallQuery.matches) {
        setPageSize(2);
      } else {
        setPageSize(12);
      }
    };
    listener();

    smallQuery.addEventListener('change', listener);

    return () => {
      smallQuery.removeEventListener('change', listener);
    };
  }, []);

  const mainCard = articlesPageData.find((item) => item.pinnedFullSize);
  const cardsWithoutMain = articlesPageData.filter(
    (item) => !item.pinnedFullSize
  );

  // отрисовка заглушки
  function renderAnimatedContainer() {
    return <AnimatedPageContainer titleText={animatedContainerText} />;
  }

  function renderPageContent() {
    return (
      <section className="articles page__section fade-in">
        <TitleH1 title={title} />
        {isLoading ? (
          <Loader isNested />
        ) : (
          <>
            {mainCard && (
              <section className="articles__main fade-in">
                <CardArticle
                  data={mainCard}
                  sectionClass="card-container_type_main-article"
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
                  sectionClass="card-container_type_article fade-in"
                />
              ))}
            </section>
            {pageCount > 1 && (
              <Paginate
                sectionClass="cards-section__pagination"
                pageCount={pageCount}
                value={pageNumber}
                onChange={setPageNumber}
              />
            )}
          </>
        )}
      </section>
    );
  }

  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      {!articlesPageData.length && !isLoading
        ? renderAnimatedContainer()
        : renderPageContent()}
    </BasePage>
  );
}

export default Articles;
