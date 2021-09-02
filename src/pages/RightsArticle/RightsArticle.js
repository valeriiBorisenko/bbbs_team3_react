import './RightsArticle.scss';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import {
  PageWithTransparentHeader,
  Loader,
  TitleH2,
  AnimatedPageContainer,
} from './index';
import { getRightsArticle } from '../../api/rights-page';
import { useScrollToTop } from '../../hooks/index';
import { ERROR_MESSAGES } from '../../config/constants';
import { RIGHTS_URL } from '../../config/routes';

function RightsArticle({ id, getActiveTags }) {
  useScrollToTop();

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

  const rendenNextPageBlock = () => {
    if (articleData.nextArticle) {
      return (
        <section className="next-page">
          <div className="next-page__img-wrap">
            <img
              src="#"
              alt="Льготы детей на жилье"
              className="next-page__img"
            />
          </div>
          <Link
            to={{
              pathname: `/rights/${articleData.nextArticle?.id}`,
              getActiveTags,
            }}
            className="next-page__link"
          >
            <TitleH2
              sectionClass="next-page__title"
              title={articleData.nextArticle?.title}
            />
            <div className="next-page__arrow-icon" />
          </Link>
        </section>
      );
    }

    return <></>;
  };

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
        {renderHtmlBlock()}
        {rendenNextPageBlock()}
      </>
    );
  };

  useEffect(() => {
    setIsLoadingPage(true);

    if (isLoadingPage && id) {
      getRightsArticle({ id, tags: getActiveTags() })
        .then((res) => setArticleData(res))
        .catch(() => setIsPageError(true))
        .finally(() => {
          setIsLoadingPage(false);
        });
    }

    if (!isLoadingPage && id) {
      getRightsArticle({
        id: articleData.nextArticle?.id,
        tags: getActiveTags(),
      })
        .then((res) => setArticleData(res))
        .catch(() => setIsPageError(true))
        .finally(() => {
          setIsLoadingPage(false);
        });
    }

    // Хард Код для демо
    window.scrollTo({ top: 0 });
  }, [id]);

  return (
    <PageWithTransparentHeader
      headTitle={articleData?.title}
      headDescription={articleData?.description}
    >
      {isLoadingPage ? <Loader isNested /> : renderMainContent()}
    </PageWithTransparentHeader>
  );
}

RightsArticle.propTypes = {
  id: PropTypes.number,
  getActiveTags: PropTypes.func,
};

RightsArticle.defaultProps = {
  id: null,
  getActiveTags: () => {},
};

export default RightsArticle;
