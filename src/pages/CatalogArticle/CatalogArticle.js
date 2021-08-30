import './CatalogArticle.scss';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  const nextPageLink = `/catalog/${catalogArticlePageData?.nextArticle?.id}`;
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
          {catalogArticlePageData.imageCaption ? (
            <figcaption className="caption article__figcaption">
              {catalogArticlePageData.imageCaption}
            </figcaption>
          ) : (
            ''
          )}
        </figure>
        <ReactMarkdown className="article__markdown">
          {catalogArticlePageData.body}
        </ReactMarkdown>
        {catalogArticlePageData.nextArticle ? (
          <Link className="article__link" to={nextPageLink}>
            <p className="article__link-text">
              {catalogArticlePageData.nextArticle.title}
            </p>
            <svg
              className="article__link-arrow"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.5916 0L30 14.3793L15.5318 30H13.4987L23.3441 19.3448C25.5145 17.1724 24.9357 15.3103 22.1865 15.1552H0V13.6034H22.0418C24.791 13.4483 25.3698 11.8966 23.6334 9.72414L14.5659 0H16.5916Z"
                fill="#224CFF"
              />
            </svg>
          </Link>
        ) : (
          ''
        )}
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
