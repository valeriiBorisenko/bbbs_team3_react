import './CatalogArticle.scss';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import { BasePage, Loader } from './index';
import getCatalogArticlePageData from '../../api/catalog-article-page';
import catalogArticlePageTexts from '../../locales/catalog-article-page-RU';
import { AnimatedPageContainer, TitleH1 } from '../Books';
import { ERROR_MESSAGES } from '../../config/constants';
import { CATALOG_URL } from '../../config/routes';
import { staticImageUrl } from '../../config/config';

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
      <div className=" page__section">
        <TitleH1
          title={catalogArticlePageData.title}
          sectionClass="article__main-title"
        />
        <p className="article__description section-title">
          {catalogArticlePageData.description}
        </p>
        <figure className="article__figure">
          <img
            src={`${staticImageUrl}/${catalogArticlePageData.image}`}
            alt={catalogArticlePageData.title}
            className="article__image"
          />
          <figcaption className="caption article__figcaption">
            Возможно подпись к фотографии. Автор фото.
          </figcaption>
        </figure>
        <ReactMarkdown className="article__markdown">
          {catalogArticlePageData.body}
        </ReactMarkdown>
      </div>
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
