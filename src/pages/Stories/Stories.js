import { useContext, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Carousel from 'react-elastic-carousel';
import { useHistory, useParams } from 'react-router-dom';
import { inclineFirstname } from 'lvovich';
import storiesPageTexts from '../../locales/stories-page-RU';
import { CurrentUserContext } from '../../contexts';
import { staticImageUrl } from '../../config/config';
import { STORIES_URL } from '../../config/routes';
import { getStoriesPageTags, getStoryById } from '../../api/stories-page';
import { formatDate, formatMonthsGenitiveCase } from '../../utils/utils';
import { handleRadioBehavior } from '../../utils/filter-tags';
import {
  AnimatedPageContainer,
  BasePage,
  Caption,
  Loader,
  NextArticleLink,
  PopupPhoto,
  PseudoButtonTag,
  ScrollableContainer,
  TitleH1,
  TitleH2,
} from './index';
import './Stories.scss';

const carouselItemPaddings = {
  desktop: [0, 65],
  tablet: [0, 15],
  mobile: [0, 7.5],
};

const maxScreenWidth = {
  tablet: '1100px',
  mobile: '706px',
};

const tagsLimit = 10;
const disablePointerEventsDelay = 150;

const { headTitle, headDescription, title, subtitle, textStubNoData } =
  storiesPageTexts;

function Stories() {
  const { storyId } = useParams();
  const history = useHistory();
  const { currentUser } = useContext(CurrentUserContext);

  const [isPageLoading, setIsPageLoading] = useState(true);

  const [storiesTags, setStoriesTags] = useState([]);
  const [tagsOffset, setTagsOffset] = useState(0);

  const [currentStory, setCurrentStory] = useState(null);
  const [isPopupPhotoOpen, setIsPopupPhotoOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState({});

  const openPhotoPopup = () => {
    setIsPopupPhotoOpen(true);
  };

  const closePhotoPopup = () => {
    setIsPopupPhotoOpen(false);
  };

  const photoCarouselRef = useRef(null);
  const [carouselItemPadding, setCarouselItemPaddings] = useState(
    carouselItemPaddings.desktop
  );
  const [isCarouselDragging, setIsCarouselDragging] = useState(false);

  const openFullPhoto = (imageSrc, caption) => {
    setCurrentPhoto({
      photoSrc: imageSrc,
      caption,
    });
    openPhotoPopup();
  };

  const preventClickOnMouseDown = () => {
    setTimeout(() => {
      setIsCarouselDragging(true);
    }, disablePointerEventsDelay);
  };

  const preventClickOnMouseUp = () => {
    setTimeout(() => {
      setIsCarouselDragging(false);
    }, disablePointerEventsDelay);
  };

  const currentStoryId = +(storyId ?? storiesTags[0]?.filter);
  const nextPageLink = `${STORIES_URL}/${currentStory?.nextArticle?.id}`;
  const pairTitle = storiesTags.find((tag) => tag.filter === currentStory?.id);
  const togetherSince = formatDate(currentStory?.togetherSince);

  const handleFilters = (inputValue, isChecked) => {
    handleRadioBehavior(setStoriesTags, { inputValue, isChecked });
    history.push(`${STORIES_URL}/${inputValue}`);
  };

  const fetchTags = ({ limit, offset }) => {
    if (tagsOffset <= storiesTags.length) {
      getStoriesPageTags({ limit, offset })
        .then(({ results }) => {
          if (results?.length) {
            // eslint-disable-next-line no-unused-vars
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
        // крашнуть страницу
        .catch(() => {
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

  // динамические падинги для фото слайдера
  useEffect(() => {
    const tablet = window.matchMedia(`(max-width: ${maxScreenWidth.tablet})`);
    const mobile = window.matchMedia(`(max-width: ${maxScreenWidth.mobile})`);

    const listenWindowWidth = () => {
      if (mobile.matches)
        return setCarouselItemPaddings(carouselItemPaddings.mobile);

      if (tablet.matches)
        return setCarouselItemPaddings(carouselItemPaddings.tablet);

      return setCarouselItemPaddings(carouselItemPaddings.desktop);
    };
    listenWindowWidth();

    mobile.addEventListener('change', listenWindowWidth);
    tablet.addEventListener('change', listenWindowWidth);

    return () => {
      mobile.removeEventListener('change', listenWindowWidth);
      tablet.removeEventListener('change', listenWindowWidth);
    };
  }, []);

  // получение списка всех историй
  useEffect(() => {
    fetchTags({ limit: tagsLimit, offset: tagsOffset });
  }, []);

  // получение конкретной истории по id
  useEffect(() => {
    if (currentStoryId) {
      // если 404 пуш на 404
      // если сетевая, то крашнуть страницу
      getStoryById(currentStoryId)
        .then(setCurrentStory)
        .catch(console.log)
        .finally(() => setIsPageLoading(false));
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
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
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
    if (!storiesTags.length) {
      return <AnimatedPageContainer titleText={textStubNoData} />;
    }

    return (
      <div className="stories page__section">
        <TitleH1 title={title} sectionClass="stories__title" />
        <p className="stories__subtitle">{subtitle}</p>

        {renderTags()}

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
    );
  }

  function renderUpperBlock() {
    return (
      <>
        <img
          className="stories__main-photo"
          src={`${staticImageUrl}/${currentStory?.image}`}
          alt={pairTitle?.name}
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
        {currentUser && currentStory?.mentor?.email && (
          <a
            className="link stories__link"
            href={`mailto:${currentStory.mentor.email}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {`написать ${inclineFirstname(
              currentStory.mentor.firstName,
              'dative'
            )}`}
          </a>
        )}

        {currentStory?.nextArticle && (
          <NextArticleLink
            text={currentStory.nextArticle.title}
            href={nextPageLink}
            onClick={fetchTagsOnNextLink}
            sectionClass="stories__link_next"
          />
        )}
      </div>
    );
  }

  function renderTags() {
    return (
      <div className="stories__tags-carousel">
        <span className="stories__scroll-anchor" ref={scrollAnchorRef} />
        <ScrollableContainer
          step={3}
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
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          className="stories__photo-carousel-wrapper"
          onMouseUp={preventClickOnMouseUp}
        >
          <Carousel
            ref={photoCarouselRef}
            className="stories__photo-carousel"
            itemsToScroll={1}
            itemsToShow={3}
            initialActiveIndex={0}
            itemPadding={carouselItemPadding}
            pagination={false}
          >
            <div aria-hidden className="stories__carousel-image" />
            {currentStory?.images?.map((image, idx) => (
              <div
                key={image.id}
                className={`stories__carousel-image-wrap ${
                  isCarouselDragging
                    ? 'stories__carousel-image-wrap_disabled-events'
                    : ''
                }`}
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
                onMouseDown={preventClickOnMouseDown}
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
