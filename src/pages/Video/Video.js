import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import videoPageTexts from './locales/RU';
import { ERROR_MESSAGES, localStChosenVideo } from '../../config/constants';
import { PopupsContext } from '../../contexts';
import { useFiltrationWithMainCard, usePageWidth } from '../../hooks';
import {
  getVideoById,
  getVideoPageData,
  getVideoPageTags,
} from '../../api/video-page';
import { setLocalStorageData } from '../../hooks/useLocalStorage';
import {
  AnimatedPageContainer,
  BasePage,
  CardFilm,
  CardVideoMain,
  Heading,
  Loader,
  NoDataNotificationBox,
  Paginate,
  TagsList,
} from './index';
import './Video.scss';

const PAGE_SIZE_PAGINATE = {
  small: 8,
  medium: 8,
  big: 12,
  default: 16,
};

const MAX_SCREEN_WIDTH = {
  small: 767,
  medium: 1023,
  big: 1450,
};

const {
  headTitle,
  headDescription,
  title,
  textStubNoData,
  paragraphNoContent,
} = videoPageTexts;

const Video = () => {
  // работа с открытием попапа видое при переходе из поиска
  const { state } = useLocation();
  const { openPopupVideo } = useContext(PopupsContext);
  // определяет, сколько карточек показывать на странице в зависимости от ширины экрана
  const { pageSize, isSmallQuery } = usePageWidth(
    MAX_SCREEN_WIDTH,
    PAGE_SIZE_PAGINATE
  );
  // стейт ошибки
  const [isPageError, setIsPageError] = useState(false);

  // фильтрация и пагинация
  const filtersAndPaginationSettings = {
    apiGetDataCallback: getVideoPageData,
    apiGetFiltersCallback: getVideoPageTags,
    apiFilterNames: {
      tags: 'tags',
      resourceGroup: 'resource_group',
    },
    pageSize,
    setIsPageError,
    isVideoPage: true,
  };

  const {
    dataToRender,
    filters,
    mainCard,
    isMainCard,
    isMainCardShown,
    isPageLoading,
    isFiltersUsed,
    isPaginationUsed,
    isNoFilteredResults,
    totalPages,
    pageIndex,
    changePageIndex,
    changeFilter,
  } = useFiltrationWithMainCard(filtersAndPaginationSettings);

  // Откртие попапа при переходе из поиска
  useEffect(() => {
    if (state) {
      getVideoById(state.id)
        .then((res) => {
          setLocalStorageData(localStChosenVideo, res);
          openPopupVideo();
        })
        .catch(() => setIsPageError(true));
    }
  }, [state]);

  // Лоадер при загрузке страницы
  if (isPageLoading) {
    return <Loader isCentered />;
  }

  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      {renderPageContent()}
    </BasePage>
  );

  function renderPageContent() {
    if (
      isPageError ||
      (!dataToRender.length && !isMainCard && !isPageLoading)
    ) {
      return renderAnimatedContainer();
    }

    return (
      <>
        <section className="lead page__section">
          <Heading
            level={1}
            type="big"
            content={title}
            sectionClass="video__title"
          />
          {renderFilters()}
        </section>

        {isFiltersUsed ? <Loader isPaginate /> : renderCardsContainer()}
      </>
    );
  }

  // контейнер заглушки
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

  function renderFilters() {
    // учитываем также кннопку ВСЕ
    if (filters.length > 2) {
      return (
        <TagsList
          filterList={filters}
          name="videos"
          handleClick={changeFilter}
        />
      );
    }
    return null;
  }

  function renderCardsContainer() {
    if (isNoFilteredResults) {
      return (
        <NoDataNotificationBox
          text={paragraphNoContent}
          isAnimated
          sectionClass="no-data-text_padding-top"
        />
      );
    }

    return (
      <>
        {isPaginationUsed ? <Loader isPaginate /> : renderCards()}
        {renderPaginate()}
      </>
    );
  }

  function renderCards() {
    return (
      <>
        {isMainCardShown && (
          <section className="video__main-card page__section scale-in">
            <CardVideoMain data={mainCard} isMobile={isSmallQuery} />
          </section>
        )}

        <section className="video__cards-grid page__section">
          {dataToRender.map((item) => (
            <CardFilm
              key={item?.id}
              data={item}
              sectionClass="scale-in"
              isMobile={isSmallQuery}
              isVideo
            />
          ))}
        </section>
      </>
    );
  }

  function renderPaginate() {
    if (totalPages > 1) {
      return (
        <section className="video__cards-paginate">
          <Paginate
            sectionClass="cards-section__pagination "
            pageCount={totalPages}
            value={pageIndex}
            onChange={changePageIndex}
          />
        </section>
      );
    }
    return null;
  }
};

export default Video;
