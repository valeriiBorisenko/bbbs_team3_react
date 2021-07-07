/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './Video.scss';

import {
  BasePage,
  Loader,
  TitleH1,
  Paginate,
  CardVideoMain,
  CardFilm,
  AnimatedPageContainer,
} from './index';
import { ALL_CATEGORIES, DELAY_DEBOUNCE } from '../../config/constants';
import { useScrollToTop, useDebounce } from '../../hooks/index';
import {
  renderFilterTags,
  handleCheckboxBehavior,
  selectOneTag,
  deselectOneTag,
} from '../../utils/filter-tags';
import { getVideoPageTags, getVideoPageData } from '../../api/video-page';
import { changeCaseOfFirstLetter, formatDuration } from '../../utils/utils';

const TEXT_STUB_NOPE_DATA =
  'В данный момент страница с видео пуста. Возвращайтесь позже!';

const PAGE_SIZE_PAGINATE = {
  small: 4,
  medium: 9,
  big: 16,
};

const defMainVideo = {
  duration: 134,
  image: '/code/project/media/videos/2_pic.jpg',
  info: 'Иван Рустаев, выпускник программы',
  link: 'https://youtu.be/H980rXfjdq4',
  title: 'Эфир с выпускником нашей программы',
};

const Video = () => {
  useScrollToTop();

  // Стейты для пагинации
  const [pageSize, setPageSize] = useState(16);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  // Стейты с данными
  const [mainVideo, setMainVideo] = useState(defMainVideo);
  const [video, setVideo] = useState(null);
  const [categories, setCategories] = useState(null);

  // Загрузка данных
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  // флаг применения фильтров
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);
  // Загрузка данных при переключении пагинации
  const [isLoadingPaginate, setIsLoadingPaginate] = useState(false);

  // хэндлер клика по фильтру КАТЕГОРИЯ
  const changeCategory = (inputValue, isChecked) => {
    if (inputValue === ALL_CATEGORIES) {
      selectOneTag(setCategories, ALL_CATEGORIES);
    } else {
      handleCheckboxBehavior(setCategories, { inputValue, isChecked });
      deselectOneTag(setCategories, ALL_CATEGORIES);
    }
    setIsFiltersUsed(true);
  };

  // отрисовка массива фильтров
  const renderTagsContainer = () => (
    <div className="tags">
      <ul className="tags__list">
        {renderFilterTags(categories, 'checkbox', changeCategory)}
      </ul>
    </div>
  );

  const renderCards = () => (
    <>
      {video.map((item) => {
        const { minutes, seconds } = formatDuration(item.duration);

        return (
          <CardFilm key={item.id} data={item}>
            <p className="card-film__duration paragraph">{`${minutes}:${seconds}`}</p>
          </CardFilm>
        );
      })}
    </>
  );

  // отрисовка контента страницы
  const renderMainContent = () => {
    // залогинен и нет статей
    if (!video && !mainVideo && !isLoadingPage) {
      return (
        <AnimatedPageContainer
          titleText={TEXT_STUB_NOPE_DATA}
          buttonText="Вернуться на главную"
        />
      );
    }

    return (
      <>
        <section className="main-card page__section">
          <CardVideoMain data={mainVideo} />
        </section>

        {isFiltersUsed || isLoadingPaginate ? (
          <Loader isCentered />
        ) : (
          <section className="cards-grid cards-grid_content_small-cards page__section">
            {renderCards()}
          </section>
        )}

        {pageCount > 1 && (
          <Paginate
            sectionClass="page__section"
            pageCount={pageCount}
            value={pageNumber}
            onChange={setPageNumber}
          />
        )}
      </>
    );
  };

  const getVideoData = (tags = '') => {
    const offset = isFiltersUsed ? 0 : pageSize * pageNumber;
    // next: null
    // previous: null
    getVideoPageData({
      limit: pageSize,
      offset,
      tags,
    })
      .then(({ results, count, previous }) => {
        // setMainVideo(previous);
        setVideo(results);
        setPageCount(Math.ceil(count / pageSize));
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoadingPage(false);
        setIsFiltersUsed(false);
        setIsLoadingPaginate(false);
      });
  };

  const getVideoTags = () => {
    getVideoPageTags()
      .then((tags) => {
        const categoriesArr = tags.map((tag) => ({
          filter: tag.slug.toLowerCase(),
          name: changeCaseOfFirstLetter(tag.name),
          isActive: false,
        }));

        setCategories([
          { filter: ALL_CATEGORIES, name: ALL_CATEGORIES, isActive: true },
          ...categoriesArr,
        ]);
      })
      .catch((err) => console.log(err));
  };

  // функция-фильтратор с использованием АПИ
  const handleFiltration = () => {
    if (!isLoadingPage && isFiltersUsed) {
      const activeCategories = categories
        .filter((filter) => filter.isActive && filter.filter !== ALL_CATEGORIES)
        .map((filter) => filter.filter)
        .join(',');

      if (activeCategories === '') {
        selectOneTag(setCategories, ALL_CATEGORIES);
      }

      getVideoData(activeCategories);
    }
  };

  // Фильтрация с делэем
  const debounceFiltration = useDebounce(handleFiltration, DELAY_DEBOUNCE);
  useEffect(() => {
    debounceFiltration();
  }, [isFiltersUsed]);

  // Первая отрисовка страницы + переход по страницам пагинации
  useEffect(() => {
    if (isLoadingPage) {
      getVideoData();
      getVideoTags();
    } else {
      setIsLoadingPaginate(true);
      getVideoData();
    }
  }, [pageSize, pageNumber]);

  // Юз эффект для пагинации
  useEffect(() => {
    const smallQuery = window.matchMedia('(max-width: 1399px)');
    const largeQuery = window.matchMedia('(max-width: 1640px)');

    const listener = () => {
      if (smallQuery.matches) {
        setPageSize(PAGE_SIZE_PAGINATE.small);
      } else if (largeQuery.matches) {
        setPageSize(PAGE_SIZE_PAGINATE.medium);
      } else {
        setPageSize(PAGE_SIZE_PAGINATE.big);
      }
    };
    listener();

    smallQuery.addEventListener('change', listener);
    largeQuery.addEventListener('change', listener);

    return () => {
      smallQuery.removeEventListener('change', listener);
      largeQuery.removeEventListener('change', listener);
    };
  }, []);

  // глобальный лоадер
  if (isLoadingPage) {
    return <Loader isCentered />;
  }

  return (
    <BasePage>
      <Helmet>
        <title>Видео</title>
        <meta name="description" content="Страница с видео контентом" />
      </Helmet>
      <section className="lead page__section">
        <TitleH1 title="Видео" />
        {categories?.length > 1 && renderTagsContainer()}
      </section>

      {renderMainContent()}
    </BasePage>
  );
};

export default Video;
