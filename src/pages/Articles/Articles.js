import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useScrollToTop } from '../../hooks/index';

import { COLORS } from '../../config/constants';
import {
  BasePage,
  TitleH1,
  CardArticle,
  Paginate,
  AnimatedPageContainer,
} from './index';
import Api from '../../utils/api';
import './Articles.scss';

function Articles() {
  useScrollToTop();

  const [pageSize, setPageSize] = useState(16);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  const [articlesPageData, setArticlesPageData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const offset = pageSize * pageNumber;
    Api.getArticlesPageData({ limit: pageSize, offset })
      .then(({ results, count }) => {
        setArticlesPageData(results);
        setPageCount(Math.ceil(count / pageSize));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [pageSize, pageNumber]);

  useEffect(() => {
    const smallQuery = window.matchMedia('(max-width: 1399px)');
    const largeQuery = window.matchMedia('(max-width: 1640px)');

    const listener = () => {
      if (smallQuery.matches) {
        setPageSize(2);
      } else if (largeQuery.matches) {
        setPageSize(12);
      } else {
        setPageSize(16);
      }
    };
    listener();

    smallQuery.addEventListener('change', listener);
    largeQuery.addEventListener('change', listener);

    return () => {
      smallQuery.removeEventListener('change', listener);
      largeQuery.removeEventListener('change', listener);
    };
  }, []);

  // отрисовка заглушки
  function returnAnimatedContainer() {
    return (
      <AnimatedPageContainer
        titleText="Информация появится в ближайшее время."
        buttonText="Вернуться на главную"
      />
    );
  }

  if (!articlesPageData.length && !isLoading) {
    return returnAnimatedContainer();
  }

  return (
    <BasePage>
      <Helmet>
        <title>Статьи</title>
        <meta
          name="description"
          content="Статьи, которые рекомендуют наши наставники"
        />
      </Helmet>
      <section className="articles page__section fade-in">
        <TitleH1 title="Статьи" />
        {isLoading && 'gffdffgdfg'}
        {!isLoading && (
          <>
            <section className="articles__main fade-in">
              <CardArticle
                data={articlesPageData.find((item) => item.main)}
                sectionClass="card-container_type_main-article"
                isMain
              />
            </section>

            <section className="articles__cards-grid">
              {articlesPageData.map((item, i) => (
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
    </BasePage>
  );
}

export default Articles;
