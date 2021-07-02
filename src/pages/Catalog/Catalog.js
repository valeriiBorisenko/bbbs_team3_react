import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  BasePage,
  TitleH1,
  TitleH2,
  CardsSectionWithLines,
  AnimatedPageContainer,
} from './index';
import Api from '../../utils/api';
import CardCatalog from '../../components/Cards/CardCatalog/CardCatalog';
import { FIGURES } from '../../config/constants';
import './Catalog.scss';

function Catalog() {
  const [pageSize, setPageSize] = useState(16);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  const [catalogPageData, setCatalogPageData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const offset = pageSize * pageNumber;
    Api.getCatalogPageData({ limit: pageSize, offset }).then(
      ({ results, count }) => {
        setCatalogPageData(results);
        setPageCount(Math.ceil(count / pageSize));
        setIsLoading(false);
      }
    );
  }, [pageSize, pageNumber]);

  useEffect(() => {
    const smallQuery = window.matchMedia('(max-width: 1399px)');
    const largeQuery = window.matchMedia('(max-width: 1640px)');

    const listener = () => {
      if (smallQuery.matches) {
        setPageSize(4);
      } else if (largeQuery.matches) {
        setPageSize(9);
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

  if (!catalogPageData.length) {
    return returnAnimatedContainer();
  }

  return (
    <BasePage>
      <Helmet>
        <title>Справочник</title>
        <meta name="description" content="Справочник полезных статей" />
      </Helmet>
      <section className="catalog page__section fade-in">
        <TitleH1 sectionClass="catalog__title" title="Справочник" />
        <TitleH2
          sectionClass="catalog__subtitle"
          title="Памятка новичка&nbsp;&mdash; наши материалы, где сможете найти всю базовую информацию,
          рассказанную на вводном тренинге. Если вы захотите освежить свои знания, и&nbsp;напомнить
          себе о&nbsp;чем-то."
        />
        {!isLoading && (
          <CardsSectionWithLines
            pageCount={pageCount}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          >
            {catalogPageData.map((item, i) => (
              <CardCatalog
                sectionClass="cards-section__item"
                key={item.id}
                title={item.title}
                image={item.imageUrl}
                shape={FIGURES[i % FIGURES.length]}
              />
            ))}
          </CardsSectionWithLines>
        )}
      </section>
    </BasePage>
  );
}

export default Catalog;
