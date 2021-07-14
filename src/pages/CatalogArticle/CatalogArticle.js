import './CatalogArticle.scss';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BasePage, Loader } from './index';
import getCatalogArticlePageData from '../../api/catalog-article-page';
import catalogArticlePageTexts from '../../locales/catalog-article-page-RU';

function CatalogArticle({ articleId }) {
  const { headTitle, headDescription } = catalogArticlePageTexts;
  const [catalogArticlePageData, setCatalogArticlePageData] = useState();
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  useEffect(() => {
    getCatalogArticlePageData({ articleId })
      .then((data) => {
        setCatalogArticlePageData(data);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoadingPage(false);
      });
  }, [articleId]);

  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      {isLoadingPage ? (
        <Loader />
      ) : (
        <div
          className="article"
          dangerouslySetInnerHTML={{
            __html: catalogArticlePageData?.content,
          }}
        />
      )}
    </BasePage>
  );
}

CatalogArticle.propTypes = {
  articleId: PropTypes.string.isRequired,
};

export default CatalogArticle;
