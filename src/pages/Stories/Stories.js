import { useContext, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Carousel from 'react-elastic-carousel';
import { useHistory, useParams } from 'react-router-dom';
import { inclineFirstname } from 'lvovich';
import storiesPageTexts from './locales/RU';
import { CurrentUserContext } from '../../contexts';
import { ERROR_CODES, ERROR_MESSAGES } from '../../config/constants';
import { staticImageUrl } from '../../config/config';
import { NOT_FOUND_URL, STORIES_URL } from '../../config/routes';
import { usePageWidth } from '../../hooks';
import { formatDate, formatMonthsGenitiveCase } from '../../utils/utils';
import { handleRadioBehavior } from '../../utils/filter-tags';
import { getStoriesPageTags, getStoryById } from '../../api/stories-page';
import {
  AnimatedPageContainer,
  BasePage,
  Caption,
  Heading,
  Loader,
  NextArticleLink,
  PopupPhoto,
  PseudoButtonTag,
  ScrollableContainer,
} from './index';
import './Stories.scss';

const CAROUSEL_ITEM_PADDINGS = {
  default: [0, 65],
  medium: [0, 15],
  small: [0, 7.5],
};

const MAX_SCREEN_WIDTH = {
  small: 706,
  medium: 1100,
};

const tagsLimit = 10;
const scrollUpDelay = 150;

const { headTitle, headDescription, title, subtitle, textStubNoData } =
  storiesPageTexts;

function Stories() {
  const { storyId } = useParams();
  const history = useHistory();
  const { currentUser } = useContext(CurrentUserContext);

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isStoryLoading, setIsStoryLoading] = useState(false);
  const [isPageError, setIsPageError] = useState(false);

  const [storiesTags, setStoriesTags] = useState([]);
  const [tagsOffset, setTagsOffset] = useState(0);

  const [currentStory, setCurrentStory] = useState({});
  const [isPopupPhotoOpen, setIsPopupPhotoOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState({});

  const openPhotoPopup = () => {
    setIsPopupPhotoOpen(true);
  };

  const closePhotoPopup = () => {
    setIsPopupPhotoOpen(false);
  };

  const currentStoryId = +(storyId ?? storiesTags[0]?.filter);
  const mentorName = currentStory.mentor?.firstName ?? '';
  const childName = currentStory.child ?? '';
  const pairTitle = `${mentorName} и ${childName}`;

  const togetherSinceDate = formatDate(currentStory.togetherSince);
  const togetherSinceText = `Вместе с ${formatMonthsGenitiveCase(
    togetherSinceDate?.monthName
  )} ${togetherSinceDate?.year} года`;

  const emailText = `написать ${inclineFirstname(mentorName, 'dative')}`;
  const nextArticleLink = `${STORIES_URL}/${currentStory.nextArticle?.id}`;

  const photoCarouselRef = useRef(null);
  const { pageSize } = usePageWidth(MAX_SCREEN_WIDTH, CAROUSEL_ITEM_PADDINGS);

  const openFullPhoto = (imageSrc, caption) => {
    setCurrentPhoto({
      photoSrc: imageSrc,
      caption,
    });
    openPhotoPopup();
  };

  const handleFilters = (inputValue) => {
    handleRadioBehavior(setStoriesTags, { inputValue, isChecked: true });
    history.push(`${STORIES_URL}/${inputValue}`);
  };

  const fetchTags = ({ limit, offset }) => {
    if (tagsOffset <= storiesTags.length) {
      getStoriesPageTags({ limit, offset })
        .then(({ results }) => {
          if (results?.length) {
            const storiesTagsData = results.map((tag) => ({
              filter: tag.id,
              name: tag.pair,
              isActive: +storyId === +tag.id,
            }));
            setStoriesTags((prevTags) => [...prevTags, ...storiesTagsData]);
            setTagsOffset((prevOffset) => prevOffset + limit);
          } else {
            setIsPageLoading(false);
          }
        })
        .catch(() => {
          setIsPageError(true);
          setIsPageLoading(false);
        });
    }
  };

  // подгрузка тегов при переключении по ссылкам внизу
  const fetchTagsOnNextLink = () => {
    if (currentStoryId === storiesTags[storiesTags.length - 1].filter) {
      fetchTags({ limit: tagsLimit, offset: tagsOffset });
    }
  };

  // получение списка всех историй
  useEffect(() => {
    fetchTags({ limit: tagsLimit, offset: tagsOffset });
  }, []);

  // получение конкретной истории по id
  useEffect(() => {
    if (currentStoryId) {
      setIsStoryLoading(true);
      getStoryById(currentStoryId)
        .then(setCurrentStory)
        .catch((err) => {
          if (err.status === ERROR_CODES.notFound) history.push(NOT_FOUND_URL);
          else setIsPageError(true);
        })
        .finally(() => {
          setIsStoryLoading(false);
          if (isPageLoading) setIsPageLoading(false);
        });
    }
  }, [currentStoryId]);

  // синхронизация фильтров в зависимости от выбранной истории
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
  }, [currentStoryId, tagsOffset]);

  // прокрутка наверх при переключении историй
  const scrollAnchorRef = useRef(null);

  useEffect(() => {
    if (scrollAnchorRef && scrollAnchorRef.current) {
      setTimeout(() => {
        scrollAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
      }, scrollUpDelay);
    }
  }, [storyId]);

  if (isPageLoading) {
    return <Loader isCentered />;
  }

  return (
    <>
      <BasePage headTitle={headTitle} headDescription={headDescription}>
        {renderPageContent()}
      </BasePage>
      <PopupPhoto
        isOpen={isPopupPhotoOpen}
        onClose={closePhotoPopup}
        currentPhoto={currentPhoto}
      />
    </>
  );

  // функции рендера
  function renderPageContent() {
    if (isPageError || !storiesTags.length) {
      return renderAnimatedContainer();
    }

    return (
      <div className="stories page__section fade-in">
        <Heading
          level={1}
          type="big"
          content={title}
          sectionClass="page__title"
        />
        <p className="stories__subtitle">{subtitle}</p>

        {renderTags()}

        {isStoryLoading ? (
          <Loader isPaginate />
        ) : (
          <>
            {renderUpperBlock()}

            <ReactMarkdown className="markdown stories__markdown fade-in">
              {currentStory.uperBody}
            </ReactMarkdown>

            {renderPhotosCarousel()}

            <ReactMarkdown className="markdown stories__markdown stories__markdown_last fade-in">
              {currentStory.lowerBody}
            </ReactMarkdown>

            {renderLinksBlock()}
          </>
        )}
      </div>
    );
  }

  // заглушка
  function renderAnimatedContainer() {
    return (
      <AnimatedPageContainer
        titleText={
          isPageError
            ? ERROR_MESSAGES.generalErrorMessage.title
            : textStubNoData
        }
      />
    );
  }

  function renderUpperBlock() {
    return (
      <>
        <img
          className="stories__main-photo scale-in"
          src={`${staticImageUrl}/${currentStory.image}`}
          alt={pairTitle}
        />
        <Heading
          level={2}
          type="medium"
          content={pairTitle}
          sectionClass="stories__pair-title fade-in"
        />
        <Caption
          title={togetherSinceText}
          sectionClass="stories__caption fade-in"
        />
        <p className="stories__subtitle stories__subtitle_last fade-in">
          {currentStory.description}
        </p>
      </>
    );
  }

  function renderLinksBlock() {
    return (
      <div className="stories__links fade-in">
        {currentUser && currentStory.mentor?.email && (
          <a
            className="link stories__link"
            href={`mailto:${currentStory.mentor.email}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {emailText}
          </a>
        )}

        {currentStory.nextArticle && (
          <NextArticleLink
            text={currentStory.nextArticle.title}
            href={nextArticleLink}
            onClick={fetchTagsOnNextLink}
            sectionClass="stories__link_next"
          />
        )}
      </div>
    );
  }

  function renderTags() {
    return (
      <div className="stories__tags-carousel fade-in">
        <span className="stories__scroll-anchor" ref={scrollAnchorRef} />
        <ScrollableContainer
          step={5}
          useButtons
          disableMouseDrag
          onScrollCallback={() =>
            fetchTags({ limit: tagsLimit, offset: tagsOffset })
          }
          sectionClass="stories__scroll-container"
          prevButtonClass="stories__prev-button"
          nextButtonClass="stories__next-button"
        >
          {storiesTags.map((item) => (
            <PseudoButtonTag
              key={item.filter}
              name={item.name}
              value={item.filter}
              title={item.name}
              isActive={item.isActive}
              onClick={handleFilters}
              sectionClass="scrollable-container__child"
            />
          ))}
        </ScrollableContainer>
      </div>
    );
  }

  function renderPhotosCarousel() {
    return (
      <div className="stories__photo-carousel-container">
        <div className="stories__photo-carousel-wrapper">
          <Carousel
            ref={photoCarouselRef}
            className="stories__photo-carousel"
            itemsToScroll={1}
            itemsToShow={3}
            initialActiveIndex={0}
            itemPadding={pageSize}
            pagination={false}
            enableMouseSwipe={false}
          >
            <div aria-hidden className="stories__carousel-image" />
            {currentStory.images?.map((image, idx) => (
              <div
                key={image.id}
                className="stories__carousel-image-wrap"
                onClick={() => {
                  photoCarouselRef.current.goTo(idx);
                  openFullPhoto(
                    `${staticImageUrl}/${image.image}`,
                    image.imageCaption
                  );
                }}
                onKeyPress={() => {
                  photoCarouselRef.current.goTo(idx);
                  openFullPhoto(
                    `${staticImageUrl}/${image.image}`,
                    image.imageCaption
                  );
                }}
                role="button"
                tabIndex={0}
              >
                <img
                  className="stories__carousel-image"
                  draggable={false}
                  src={`${staticImageUrl}/${image.image}`}
                  alt={image.imageCaption}
                />
              </div>
            ))}
            <div aria-hidden className="stories__carousel-image" />
          </Carousel>
        </div>
      </div>
    );
  }
}

export default Stories;
