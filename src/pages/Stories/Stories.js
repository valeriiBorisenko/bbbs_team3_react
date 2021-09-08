import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Carousel from 'react-elastic-carousel';
import { useParams } from 'react-router-dom';
import {
  BasePage,
  Caption,
  Loader,
  NextArticleLink,
  PseudoButtonTag,
  ScrollableContainer,
  TitleH1,
  TitleH2,
} from './index';
import storiesPageTexts from '../../locales/stories-page-RU';
import { staticImageUrl } from '../../config/config';
import { STORIES_URL } from '../../config/routes';
import { getStoriesPageTags, getStoryById } from '../../api/stories-page';
import { formatDate, formatMonthsGenitiveCase } from '../../utils/utils';
import './Stories.scss';

const { headTitle, headDescription, title, subtitle } = storiesPageTexts;

function Stories() {
  const { storyId } = useParams();

  const [storiesTags, setStoriesTags] = useState([]);
  const [currentStory, setCurrentStory] = useState(null);
  const nextPageLink = `${STORIES_URL}/${currentStory?.nextArticle?.id}`;

  useEffect(() => {
    getStoriesPageTags()
      .then(({ results }) => {
        if (results?.length) {
          const storiesTagsData = results.map((tag) => ({
            filter: tag.id,
            name: tag.pair,
            isActive: false,
          }));

          setStoriesTags(storiesTagsData);
        }
      })
      .catch(console.log);
  }, []);

  useEffect(() => {
    if (storiesTags.length) {
      const id = storyId ?? storiesTags[0].filter;
      getStoryById(id).then(setCurrentStory).catch(console.log);
    }
  }, [storiesTags, storyId]);

  const pairTitle = storiesTags.find((tag) => tag.filter === currentStory?.id);
  const togetherSince = formatDate(currentStory?.togetherSince);

  if (!currentStory && !storiesTags.length) {
    return <Loader isCentered />;
  }

  return (
    <BasePage
      headTitle={headTitle}
      headDescription={headDescription}
      scrollUpDeps={[storyId]}
    >
      <div className="stories page__section">
        <TitleH1 title={title} sectionClass="stories__title" />
        <p className="stories__subtitle">{subtitle}</p>

        {renderTagsCarousel()}

        {renderUpperBlock()}

        <ReactMarkdown className="stories__markdown">
          {currentStory?.uperBody}
        </ReactMarkdown>

        {renderPhotosCarousel()}

        <ReactMarkdown className="stories__markdown stories__markdown_last">
          {currentStory?.lowerBody}
        </ReactMarkdown>

        {renderLinksBlock()}
      </div>
    </BasePage>
  );

  // функции рендера
  function renderUpperBlock() {
    return (
      <>
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
      </>
    );
  }

  function renderLinksBlock() {
    return (
      <div className="stories__links">
        <a
          className="link stories__link"
          href={`mailto:${currentStory?.mentor?.email}`}
        >{`написать ${currentStory?.mentor?.firstName}`}</a>
        <NextArticleLink
          text={currentStory?.nextArticle?.title}
          href={nextPageLink}
        />
      </div>
    );
  }

  function renderTagsCarousel() {
    return (
      <ScrollableContainer step={6} sectionClass="stories__tags-carousel">
        {storiesTags?.map((item) => (
          <PseudoButtonTag
            name={item.name}
            value={item.filter}
            title={item.name}
            isActive={item.isActive}
            onClick={() => {}}
          />
        ))}
      </ScrollableContainer>
    );
  }

  function renderPhotosCarousel() {
    return <Carousel />;
  }
}

export default Stories;
