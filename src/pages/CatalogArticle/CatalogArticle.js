import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useHistory, useParams } from 'react-router-dom';
import catalogArticlePageTexts from './locales/RU';
import { ERROR_CODES, ERROR_MESSAGES } from '../../config/constants';
import { CATALOG_URL, NOT_FOUND_URL } from '../../config/routes';
import { staticImageUrl } from '../../config/config';
import { getCatalogArticlePageData } from '../../api/catalog-page';
import {
  AnimatedPageContainer,
  BasePage,
  Heading,
  Loader,
  NextArticleLink,
  Paragraph,
} from './index';
import './CatalogArticle.scss';

const { headTitle, headDescription, stubButtonText } = catalogArticlePageTexts;

function CatalogArticle() {
  const { articleId } = useParams();
  const history = useHistory();

  const [catalogArticlePageData, setCatalogArticlePageData] = useState({});
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  // Стейт ошибки
  const [isPageError, setIsPageError] = useState(false);

  const nextPageLink = `/catalog/${catalogArticlePageData?.nextArticle?.id}`;

  useEffect(() => {
    setIsLoadingPage(true);
    if (articleId) {
      getCatalogArticlePageData(articleId)
        .then((data) => {
          setCatalogArticlePageData(data);
        })
        .catch((err) => {
          if (err.status === ERROR_CODES.notFound) history.push(NOT_FOUND_URL);
          else setIsPageError(true);
        })
        .finally(() => {
          setIsLoadingPage(false);
        });
    }
  }, [articleId]);

  return (
    <BasePage
      headTitle={catalogArticlePageData?.title ?? headTitle}
      headDescription={catalogArticlePageData?.description ?? headDescription}
      scrollUpDeps={[articleId]}
    >
      {isLoadingPage ? <Loader isPaginate /> : renderPage()}
    </BasePage>
  );

  function renderPage() {
    if (isPageError) {
      return (
        <AnimatedPageContainer
          titleText={ERROR_MESSAGES.generalErrorMessage.title}
          urlBack={CATALOG_URL}
          buttonText={stubButtonText}
          staticPage
        />
      );
    }
    return (
      <div className="article page__section fade-in">
        <Heading
          level={1}
          type="medium"
          content={catalogArticlePageData.title}
          sectionClass="article__main-title"
        />
        <Paragraph
          size="big"
          content={catalogArticlePageData.description}
          sectionClass="article__description"
        />
        <figure className="article__figure">
          <img
            src={`${staticImageUrl}/${catalogArticlePageData.image}`}
            alt={catalogArticlePageData.title}
            className="article__image scale-in"
          />
          {catalogArticlePageData.imageCaption && (
            <figcaption className="caption article__figcaption">
              {catalogArticlePageData.imageCaption}
            </figcaption>
          )}
        </figure>
        <div className="article__container">
          <ReactMarkdown className="markdown article__markdown">
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
}

export default CatalogArticle;
