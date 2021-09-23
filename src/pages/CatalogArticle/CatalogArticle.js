import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import getCatalogArticlePageData from '../../api/catalog-article-page';
import catalogArticlePageTexts from '../../locales/catalog-article-page-RU';
import { ERROR_MESSAGES } from '../../config/constants';
import { CATALOG_URL } from '../../config/routes';
import { staticImageUrl } from '../../config/config';
import {
  AnimatedPageContainer,
  BasePage,
  Loader,
  NextArticleLink,
  TitleH1,
} from './index';
import './CatalogArticle.scss';

function CatalogArticle() {
  const { articleId } = useParams();

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
      <div className="article page__section">
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
        <div className="article__container">
          <ReactMarkdown className="article__markdown">
            {catalogArticlePageData.body}
          </ReactMarkdown>

          {catalogArticlePageData.nextArticle && (
            <NextArticleLink
              text={catalogArticlePageData.nextArticle.title}
              href={nextPageLink}
              sectionClass="article__next-article-link"
            />
          )}
        </div>
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

export default CatalogArticle;
