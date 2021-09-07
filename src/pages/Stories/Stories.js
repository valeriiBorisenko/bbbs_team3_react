import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { BasePage, Caption, TagsList, TitleH1, TitleH2 } from './index';
import storiesPageTexts from '../../locales/stories-page-RU';
import { staticImageUrl } from '../../config/config';
import { getStoriesPageTags, getStoryById } from '../../api/stories-page';
import { formatDate, formatMonthsGenitiveCase } from '../../utils/utils';
import './Stories.scss';

const { headTitle, headDescription, title, subtitle } = storiesPageTexts;

function Stories() {
  const [storiesTags, setStoriesTags] = useState([]);
  const [currentStory, setCurrentStory] = useState({});

  useEffect(() => {
    getStoriesPageTags()
      .then(({ count, results }) => {
        if (count > 0) {
          getStoryById(results[0].id).then(setCurrentStory).catch(console.log);
        }
        const storiesTagsData = results?.map((tag) => ({
          filter: tag?.id,
          name: tag?.pair,
          isActive: false,
        }));

        setStoriesTags(storiesTagsData);
      })
      .catch(console.log);
  }, []);

  const pairTitle = storiesTags.find((tag) => tag.filter === currentStory?.id);
  const togetherSince = formatDate(currentStory?.togetherSince);

  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      <TitleH1 title={title} sectionClass="stories__title" />
      <p className="stories__subtitle">{subtitle}</p>

      {/* Slider */}

      <TagsList
        filterList={storiesTags}
        name="stories"
        handleClick={() => {}}
        sectionClass="stories__tags"
      />
      <img
        className="stories__main-photo"
        src={`${staticImageUrl}/${currentStory?.image}`}
        alt={currentStory?.title}
      />
      <TitleH2 title={pairTitle?.name} sectionClass="stories__pair-title" />
      <Caption
        title={`Вместе с ${formatMonthsGenitiveCase(
          togetherSince?.monthName
        )} ${togetherSince?.year} года`}
        sectionClass="stories__caption"
      />
      <p className="stories__subtitle stories__subtitle_block">
        {currentStory?.description}
      </p>
      <ReactMarkdown className="stories__markdown">
        {currentStory?.uperBody}
      </ReactMarkdown>

      {/* Slider */}

      <ReactMarkdown className="stories__markdown stories__markdown_last">
        {currentStory?.lowerBody}
      </ReactMarkdown>

      <div className="stories__links">
        <a
          className="link stories__link"
          href={`mailto:${currentStory?.mentor?.email}`}
        >{`написать ${currentStory?.mentor?.firstName}`}</a>
        <Link className="article__link" to="/">
          <p className="article__link-text">
            {currentStory?.nextArticle?.title}
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
      </div>
    </BasePage>
  );
}

export default Stories;
