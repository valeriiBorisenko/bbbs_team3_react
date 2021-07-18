import './CatalogArticle.scss';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BasePage, Loader } from './index';
import getCatalogArticlePageData from '../../api/catalog-article-page';
import catalogArticlePageTexts from '../../locales/catalog-article-page-RU';
import { AnimatedPageContainer } from '../Books';
import { ERROR_MESSAGES } from '../../config/constants';
import { CATALOG_URL } from '../../config/routes';

function CatalogArticle({ articleId }) {
  const { headTitle, headDescription } = catalogArticlePageTexts;
  const [catalogArticlePageData, setCatalogArticlePageData] = useState();
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  // Стейт ошибки
  const [isPageError, setIsPageError] = useState(false);

  useEffect(() => {
    getCatalogArticlePageData({ articleId })
      .then((data) => {
        setCatalogArticlePageData(data);
      })
      .catch(() => setIsPageError(true))
      .finally(() => {
        setIsLoadingPage(false);
      });
  }, [articleId]);

  function renderPage() {
    if (isPageError) {
      return (
        <AnimatedPageContainer
          titleText={ERROR_MESSAGES.generalErrorMessage.title}
          urlBack={CATALOG_URL}
          buttonText="Вернуться назад"
          staticPage
        />
      );
    }
    return (
      <div
        className="page__section"
        dangerouslySetInnerHTML={{
          __html: catalogArticlePageData?.rawHtml,
        }}
      />
    );
  }

  if (isLoadingPage) {
    return <Loader isCentered />;
  }

  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      {renderPage()}
    </BasePage>
  );
}

CatalogArticle.propTypes = {
  articleId: PropTypes.string.isRequired,
};

export default CatalogArticle;
