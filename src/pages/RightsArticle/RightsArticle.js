import './RightsArticle.scss';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useLocation, useParams } from 'react-router-dom';
import { useScrollToTop } from '../../hooks';
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
  const { state } = useLocation();

  useScrollToTop([articleId]);

  const [articleData, setArticleData] = useState(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  // Стейт ошибки
  const [isPageError, setIsPageError] = useState(false);

  const getArticleData = ({ id, tags }) => {
    getRightsArticle({ id, tags })
      .then((res) => setArticleData(res))
      .catch(() => setIsPageError(true))
      .finally(() => {
        setIsLoadingPage(false);
      });
  };

  useEffect(() => {
    if (articleId) {
      setIsLoadingPage(true);
      if (state?.fromRightsPage) {
        getArticleData({ id: articleId, tags: state.activeTags });
      } else {
        getArticleData({ id: articleId, tags: '' });
      }
    }
  }, [articleId]);

  return (
    <BasePage
      headTitle={articleData?.title ?? 'Право'}
      headDescription={articleData?.description ?? 'Право'}
      isHeaderTransparentOnTop
    >
      {isLoadingPage ? <Loader isNested /> : renderMainContent()}
    </BasePage>
  );

  function renderMainContent() {
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
            {renderNextPageBlock()}
          </div>
        </div>
      </>
    );
  }

  function renderLeadBlock() {
    return (
      <section className="article-lead">
        <div className="article-lead__content">
          <h1 className="chapter-title article-lead__title">
            {articleData?.title}
          </h1>
          <p className="section-title article-lead__text">
            {articleData?.text}
          </p>
        </div>
      </section>
    );
  }

  function renderHtmlBlock() {
    return (
      <ReactMarkdown className="article__markdown">
        {articleData?.body}
      </ReactMarkdown>
    );
  }

  function renderNextPageBlock() {
    if (articleData && articleData.nextArticle) {
      // если пришли со страницы Прав, то передаём активные теги в линку
      const link = state?.fromRightsPage
        ? {
            pathname: `/rights/${articleData?.nextArticle?.id}`,
            state: { fromRightsPage: true, activeTags: state.activeTags },
          }
        : `/rights/${articleData?.nextArticle?.id}`;

      return (
        <NextArticleLink
          text={articleData.nextArticle.title}
          href={link}
          sectionClass="article__next-article-link"
        />
      );
    }
    return null;
  }
}

export default RightsArticle;
