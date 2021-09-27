import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import videoPageTexts from './locales/RU';
import { ERROR_MESSAGES, localStChosenVideo } from '../../config/constants';
import { PopupsContext } from '../../contexts';
import { useFiltrationWithMainCard, usePageWidth } from '../../hooks';
import {
  getVideo,
  getVideoPageData,
  getVideoPageTags,
} from '../../api/video-page';
import { setLocalStorageData } from '../../hooks/useLocalStorage';
import {
  AnimatedPageContainer,
  BasePage,
  CardFilm,
  CardVideoMain,
  Loader,
  Paginate,
  TagsList,
  TitleH1,
} from './index';
import './Video.scss';

const PAGE_SIZE_PAGINATE = {
  small: 8,
  medium: 12,
  default: 16,
};

const MAX_SCREEN_WIDTH = {
  small: 1023,
  medium: 1450,
};

const { headTitle, headDescription, title, textStubNoData } = videoPageTexts;

const Video = () => {
  // работа с открытием попапа видое при переходе из поиска
  const { state } = useLocation();
  const { openPopupVideo } = useContext(PopupsContext);
  // определяет, сколько карточек показывать на странице в зависимости от ширины экрана
  const pageSize = usePageWidth(MAX_SCREEN_WIDTH, PAGE_SIZE_PAGINATE);
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
    totalPages,
    pageIndex,
    changePageIndex,
    changeFilter,
  } = useFiltrationWithMainCard(filtersAndPaginationSettings);

  // Откртие попапа при переходе из поиска
  useEffect(() => {
    if (state) {
      getVideo(state.id)
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
    if (isPageError) {
      return (
        <AnimatedPageContainer
          titleText={ERROR_MESSAGES.generalErrorMessage.title}
        />
      );
    }

    if (!dataToRender.length && !isMainCard && !isPageLoading) {
      return renderAnimatedContainer();
    }

    return (
      <>
        <section className="lead page__section">
          <TitleH1 title={title} sectionClass="video__title" />
          {renderFilters()}
        </section>

        {isFiltersUsed ? <Loader isPaginate /> : renderCardsContainer()}
      </>
    );
  }

  function renderFilters() {
    if (filters?.length > 1) {
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

  // контейнер заглушки
  function renderAnimatedContainer() {
    return <AnimatedPageContainer titleText={textStubNoData} />;
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

  function renderCardsContainer() {
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
            <CardVideoMain data={mainCard} />
          </section>
        )}

        <section className="video__cards-grid page__section">
          {dataToRender.map((item) => (
            <CardFilm
              key={item?.id}
              data={item}
              sectionClass="scale-in"
              isVideo
            />
          ))}
        </section>
      </>
    );
  }
};

export default Video;
