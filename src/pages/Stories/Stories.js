import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  BasePage,
  Caption,
  NextArticleLink,
  TagsList,
  TitleH1,
  TitleH2,
} from './index';
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
      <div className="stories page__section">
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
          <NextArticleLink text={currentStory?.nextArticle?.title} href="/" />
        </div>
      </div>
    </BasePage>
  );
}

export default Stories;
