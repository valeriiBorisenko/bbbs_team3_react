import './Catalog.scss';
import { useEffect, useState } from 'react';
import catalogPageTexts from '../../locales/catalog-page-RU';
import {
  BasePage,
  TitleH1,
  TitleH2,
  CardsSectionWithLines,
  AnimatedPageContainer,
  Loader,
} from './index';
import getCatalogPageData from '../../api/catalog-page';
import CardCatalog from '../../components/Cards/CardCatalog/CardCatalog';
import { FIGURES } from '../../config/constants';

const PAGE_SIZE_PAGINATE = {
  small: 4,
  medium: 9,
  big: 16,
};

function Catalog() {
  const { headTitle, headDescription, title, subtitle, textStubNoData } =
    catalogPageTexts;

  const [pageSize, setPageSize] = useState(16);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  const [catalogPageData, setCatalogPageData] = useState([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isLoadingPaginate, setIsLoadingPaginate] = useState(false);

  function getPageData() {
    const offset = pageSize * pageNumber;

    getCatalogPageData({ limit: pageSize, offset })
      .then(({ results, count }) => {
        setCatalogPageData(results);
        setPageCount(Math.ceil(count / pageSize));
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoadingPaginate(false);
        setIsLoadingPage(false);
      });
  }

  useEffect(() => {
    if (!isLoadingPage) {
      setIsLoadingPaginate(true);
    }

    getPageData();
  }, [pageSize, pageNumber]);

  useEffect(() => {
    const smallQuery = window.matchMedia('(max-width: 1399px)');
    const largeQuery = window.matchMedia('(max-width: 1640px)');

    const listener = () => {
      if (smallQuery.matches) {
        setPageSize(PAGE_SIZE_PAGINATE.small);
      } else if (largeQuery.matches) {
        setPageSize(PAGE_SIZE_PAGINATE.medium);
      } else {
        setPageSize(PAGE_SIZE_PAGINATE.big);
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

  function renderCards() {
    return (
      <CardsSectionWithLines
        pageCount={pageCount}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        isLoading={isLoadingPaginate}
      >
        {catalogPageData.map((item, i) => (
          <CardCatalog
            sectionClass="cards-section__item"
            key={item?.id}
            title={item?.title}
            image={item?.imageUrl}
            shape={FIGURES[i % FIGURES.length]}
          />
        ))}
      </CardsSectionWithLines>
    );
  }

  function renderPageContent() {
    if (!catalogPageData && !isLoadingPage) {
      return <AnimatedPageContainer titleText={textStubNoData} />;
    }

    return (
      <section className="catalog page__section fade-in">
        <TitleH1 sectionClass="catalog__title" title={title} />
        <TitleH2 sectionClass="catalog__subtitle" title={subtitle} />
        {renderCards()}
      </section>
    );
  }

  if (isLoadingPage) {
    return <Loader isCentered />;
  }

  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      {renderPageContent()}
    </BasePage>
  );
}

export default Catalog;
