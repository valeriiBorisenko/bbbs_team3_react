import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Carousel from 'react-elastic-carousel';
import { useHistory, useParams } from 'react-router-dom';
import storiesPageTexts from '../../locales/stories-page-RU';
import { staticImageUrl } from '../../config/config';
import { STORIES_URL } from '../../config/routes';
import { getStoriesPageTags, getStoryById } from '../../api/stories-page';
import { formatDate, formatMonthsGenitiveCase } from '../../utils/utils';
import { handleRadioBehavior } from '../../utils/filter-tags';
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
import './Stories.scss';

const { headTitle, headDescription, title, subtitle } = storiesPageTexts;

function Stories() {
  const { storyId } = useParams();
  const history = useHistory();
  const photoCarouselRef = useRef(null);

  const [storiesTags, setStoriesTags] = useState([]);
  const [currentStory, setCurrentStory] = useState(null);

  const currentStoryId = +(storyId ?? storiesTags[0]?.filter);
  const nextPageLink = `${STORIES_URL}/${currentStory?.nextArticle?.id}`;

  const handleFilters = (inputValue, isChecked) => {
    handleRadioBehavior(setStoriesTags, { inputValue, isChecked });
    history.push(`${STORIES_URL}/${inputValue}`);
  };

  useEffect(() => {
    getStoriesPageTags()
      .then(({ results }) => {
        if (results?.length) {
          const storiesTagsData = results.map((tag) => ({
            filter: tag.id,
            name: tag.pair,
            isActive: +storyId === +tag.id,
          }));
          setStoriesTags(storiesTagsData);
        }
      })
      .catch(console.log);
  }, []);

  useEffect(() => {
    if (storiesTags.length && currentStoryId) {
      getStoryById(currentStoryId).then(setCurrentStory).catch(console.log);
    }
  }, [storiesTags, currentStoryId]);

  useEffect(() => {
    if (storiesTags.length) {
      const tagToBeActive = storiesTags.find(
        (tag) => tag.filter === currentStoryId
      );
      if (tagToBeActive) {
        handleRadioBehavior(setStoriesTags, {
          inputValue: tagToBeActive.filter,
          isChecked: true,
        });
      }
    }
  }, [currentStoryId]);

  const pairTitle = storiesTags.find((tag) => tag.filter === currentStory?.id);
  const togetherSince = formatDate(currentStory?.togetherSince);

  if (!currentStory && !storiesTags.length) {
    return <Loader isCentered />;
  }

  // бесконечная прокрутка карусели с фото с возвращением на старт/конец
  const onNextStart = (currentItem, nextItem) => {
    if (currentItem.index === nextItem.index) {
      photoCarouselRef.current.goTo(0);
    }
  };

  const onPrevStart = (currentItem, nextItem) => {
    if (currentItem.index === nextItem.index) {
      photoCarouselRef.current.goTo(currentStory?.images?.length);
    }
  };

  return (
    currentStory && (
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
            {currentStory.uperBody}
          </ReactMarkdown>

          {renderPhotosCarousel()}

          <ReactMarkdown className="stories__markdown stories__markdown_last">
            {currentStory.lowerBody}
          </ReactMarkdown>

          {renderLinksBlock()}
        </div>
      </BasePage>
    )
  );

  // функции рендера
  function renderUpperBlock() {
    return (
      <>
        <img
          className="stories__main-photo"
          src={`${staticImageUrl}/${currentStory?.image}`}
          alt={currentStory.title}
        />
        <TitleH2 title={pairTitle?.name} sectionClass="stories__pair-title" />
        <Caption
          title={`Вместе с ${formatMonthsGenitiveCase(
            togetherSince?.monthName
          )} ${togetherSince?.year} года`}
          sectionClass="stories__caption"
        />
        <p className="stories__subtitle stories__subtitle_block">
          {currentStory.description}
        </p>
      </>
    );
  }

  function renderLinksBlock() {
    return (
      <div className="stories__links">
        <a
          className="link stories__link"
          href={`mailto:${currentStory.mentor?.email}`}
        >{`написать ${currentStory.mentor?.firstName}`}</a>
        {currentStory.nextArticle && (
          <NextArticleLink
            text={currentStory.nextArticle.title}
            href={nextPageLink}
            sectionClass="stories__link_next"
          />
        )}
      </div>
    );
  }

  function renderTagsCarousel() {
    return (
      <ScrollableContainer step={6} sectionClass="stories__tags-carousel">
        {storiesTags.map((item) => (
          <PseudoButtonTag
            key={item.filter}
            name={item.name}
            value={item.filter}
            title={item.name}
            isActive={item.isActive}
            onClick={handleFilters}
          />
        ))}
      </ScrollableContainer>
    );
  }

  function renderPhotosCarousel() {
    return (
      <div className="stories__photo-carousel-container">
        <Carousel
          ref={photoCarouselRef}
          className="stories__photo-carousel"
          itemsToScroll={1}
          itemsToShow={1}
          itemPadding={[0, 50]}
          onPrevStart={onPrevStart}
          onNextStart={onNextStart}
          disableArrowsOnEnd={false}
          pagination={false}
        >
          {currentStory?.images?.map((image) => (
            <img
              className="stories__carousel-image"
              draggable={false}
              key={image.id}
              src={`${staticImageUrl}/${image.image}`}
              alt={image.imageCaption}
            />
          ))}
        </Carousel>
      </div>
    );
  }
}

export default Stories;
