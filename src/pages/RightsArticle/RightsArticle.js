import './RightsArticle.scss';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useLocation, useParams } from 'react-router-dom';
import {
  AnimatedPageContainer,
  BasePage,
  Loader,
  NextArticleLink,
} from './index';
import { getRightsArticle } from '../../api/rights-page';
import { ERROR_MESSAGES } from '../../config/constants';
import { RIGHTS_URL } from '../../config/routes';

function RightsArticle() {
  const { articleId } = useParams();
  const location = useLocation();
  const getTags = location.getActiveTags ?? (() => '');

  const [articleData, setArticleData] = useState(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  // Стейт ошибки
  const [isPageError, setIsPageError] = useState(false);

  const renderLeadBlock = () => (
    <section className="article-lead">
      <div className="article-lead__content">
        <h1 className="chapter-title article-lead__title">
          {articleData?.title}
        </h1>
        <p className="section-title article-lead__text">{articleData?.text}</p>
      </div>
    </section>
  );

  const renderHtmlBlock = () => (
    <ReactMarkdown className="article__markdown">
      {articleData.body}
    </ReactMarkdown>
  );

  const rendenNextPageBlock = () =>
    articleData.nextArticle && (
      <NextArticleLink
        text={articleData.nextArticle.title}
        href={{
          pathname: `/rights/${articleData?.nextArticle?.id}`,
          getActiveTags: getTags,
        }}
        sectionClass="article__next-article-link"
      />
    );

  const renderMainContent = () => {
    if (isPageError) {
      return (
        <AnimatedPageContainer
          titleText={ERROR_MESSAGES.generalErrorMessage.title}
          urlBack={RIGHTS_URL}
          buttonText="Вернуться назад"
          staticPage
        />
      );
    }

    return (
      <>
        {renderLeadBlock()}
        <div className="article page-section">
          <div className="article__container">
            {renderHtmlBlock()}
            {rendenNextPageBlock()}
          </div>
        </div>
      </>
    );
  };

  useEffect(() => {
    setIsLoadingPage(true);

    if (isLoadingPage && articleId && location) {
      getRightsArticle({ id: articleId, tags: getTags() })
        .then((res) => setArticleData(res))
        .catch(() => setIsPageError(true))
        .finally(() => {
          setIsLoadingPage(false);
        });
    }

    if (!isLoadingPage && articleId && location) {
      getRightsArticle({
        id: articleData.nextArticle?.id,
        tags: getTags(),
      })
        .then((res) => setArticleData(res))
        .catch(() => setIsPageError(true))
        .finally(() => {
          setIsLoadingPage(false);
        });
    }
  }, [articleId, location]);

  return (
    <BasePage
      headTitle={articleData?.title ?? 'Право'}
      headDescription={articleData?.description ?? 'Право'}
      isHeaderTransparentOnTop
    >
      {isLoadingPage ? <Loader isNested /> : renderMainContent()}
    </BasePage>
  );
}

export default RightsArticle;
