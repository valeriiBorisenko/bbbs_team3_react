import './RightsArticle.scss';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  PageWithTransparentHeader,
  Loader,
  TitleH2,
  AnimatedPageContainer,
} from './index';
import { getRightsArticle } from '../../api/rights-page';
import { ERROR_MESSAGES } from '../../config/constants';
import { RIGHTS_URL } from '../../config/routes';

function RightsArticle({ id }) {
  const [articleData, setArticleData] = useState(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  // Стейт ошибки
  const [isPageError, setIsPageError] = useState(false);

  // ХардКод пока не понятно как узнавать ID следующей статьи
  const [nextId, setNextId] = useState(Number(id) + 1);

  const changeClick = () => {
    setIsLoadingPage(true);
    setNextId(nextId + 1);
  };

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
    <div
      className="page__section"
      dangerouslySetInnerHTML={{
        __html: articleData?.rawHtml,
      }}
    />
  );

  const rendenNextPageBlock = () => (
    <section className="next-page">
      <div className="next-page__img-wrap">
        <img src="#" alt="Льготы детей на жилье" className="next-page__img" />
      </div>
      <Link
        to={`/rights/${nextId}`}
        onClick={changeClick}
        className="next-page__link"
        target="_self"
      >
        <TitleH2 sectionClass="next-page__title" title="Следующая статья" />
        <div className="next-page__arrow-icon" />
      </Link>
    </section>
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
        {renderHtmlBlock()}
        {rendenNextPageBlock()}
      </>
    );
  };

  useEffect(() => {
    if (isLoadingPage && id) {
      getRightsArticle(id)
        .then((res) => setArticleData(res))
        .catch(() => setIsPageError(true))
        .finally(() => {
          setIsLoadingPage(false);
        });
    }

    if (!isLoadingPage && id) {
      getRightsArticle(nextId)
        .then((res) => setArticleData(res))
        .catch(() => setIsPageError(true))
        .finally(() => {
          setIsLoadingPage(false);
        });
    }

    // Хард Код для демо
    window.scrollTo({ top: 0 });
  }, [id, nextId]);

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
};

RightsArticle.defaultProps = {
  id: null,
};

export default RightsArticle;
