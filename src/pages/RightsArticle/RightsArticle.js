import './RightsArticle.scss';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BasePage, Loader } from './index';
import { getRightsArticle } from '../../api/rights-page';

function RightsArticle({ id }) {
  const [articleData, setArticleData] = useState(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  useEffect(() => {
    if (id) {
      getRightsArticle(id)
        .then((res) => {
          setArticleData(res);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setIsLoadingPage(false);
        });
    }
  }, [id]);

  return (
    <BasePage
      headTitle={articleData?.title}
      headDescription={articleData?.description}
    >
      {isLoadingPage && !articleData ? (
        <Loader />
      ) : (
        <div
          className="article-container"
          dangerouslySetInnerHTML={{
            __html: articleData?.rawHtml,
          }}
        />
      )}
    </BasePage>
  );
}

RightsArticle.propTypes = {
  id: PropTypes.number,
};

RightsArticle.defaultProps = {
  id: null,
};

export default RightsArticle;
