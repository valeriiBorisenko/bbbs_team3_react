import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import articlesPageTexts from './locales/RU';
import { COLORS, ERROR_MESSAGES } from '../../config/constants';
import { useFiltrationWithMainCard, usePageWidth } from '../../hooks';
import { getArticle, getArticlesPageData } from '../../api/articles-page';
import {
  AnimatedPageContainer,
  BasePage,
  CardArticle,
  Loader,
  Paginate,
  PopupArticle,
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
  const { state } = useLocation();
  const searchArticleId = state?.id;
  const [searchedArticle, setSearchedArticle] = useState({});

  const [isPageError, setIsPageError] = useState(false);
  const [isArticlePopupOpen, setIsArticlePopupOpen] = useState(false);

  const pageSize = usePageWidth(MAX_SCREEN_WIDTH, PAGE_SIZE_PAGINATE);

  const openPopupArticle = () => {
    setIsArticlePopupOpen(true);
  };

  const closePopupArticle = () => {
    setIsArticlePopupOpen(false);
  };

  // фильтрация и пагинация
  const filtersAndPaginationSettings = {
    apiGetDataCallback: getArticlesPageData,
    pageSize,
    setIsPageError,
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

  // Открытие попапа при переходе из поиска
  useEffect(() => {
    if (state) {
      getArticle(searchArticleId)
        .then((article) => {
          setSearchedArticle(article);
          openPopupArticle();
        })
        .catch(() => setIsPageError(true));
    }
  }, [state]);

  if (isPageLoading) {
    return <Loader isCentered />;
  }

  return (
    <>
      <BasePage headTitle={headTitle} headDescription={headDescription}>
        {renderPageContent()}
      </BasePage>
      <PopupArticle
        isOpen={isArticlePopupOpen}
        onClose={closePopupArticle}
        article={searchedArticle}
      />
    </>
  );

  function renderPageContent() {
    if (isPageError || (!dataToRender.length && !isMainCard)) {
      return renderAnimatedContainer();
    }

    return (
      <section className="articles page__section">
        <TitleH1 title={title} sectionClass="fade-in" />

        {isPaginationUsed ? <Loader isPaginate /> : renderCards()}

        {renderPagination()}
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
