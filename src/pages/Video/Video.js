/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './Video.scss';

import { BasePage, Loader, TitleH1, Paginate, CardVideoMain } from './index';
import { useScrollToTop } from '../../hooks/index';
import {
  renderFilterTags,
  handleCheckboxBehavior,
  selectOneTag,
  deselectOneTag,
} from '../../utils/filter-tags';

const Video = () => {
  useScrollToTop();

  // Загрузка данных
  const [isLoading, setIsLoading] = useState(true);
  // флаг применения фильтров
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);

  // Стейты с данными
  const [video, setVideo] = useState(null);
  const [categories, setCategories] = useState(null);

  // Стейты для пагинации
  const [pageSize, setPageSize] = useState(16);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  // хэндлер клика по фильтру КАТЕГОРИЯ
  const changeCategory = (inputValue, isChecked) => {
    handleCheckboxBehavior(setCategories, { inputValue, isChecked });
    setIsFiltersUsed(true);
  };

  // отрисовка массива фильтров
  const renderTagsContainder = () => (
    <div className="tags">
      <ul className="tags__list">
        {renderFilterTags(categories, 'checkbox', changeCategory)}
      </ul>
    </div>
  );

  // отрисовка контента страницы
  const renderMainContent = () => <section>Гриды</section>;

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 4 * 1000);
  }, []);

  // глобальный лоадер
  // if (isLoading || !video || !categories) {
  //   return <Loader isCentered />;
  // }

  return (
    <BasePage>
      <Helmet>
        <title>Видео</title>
        <meta name="description" content="Страница с видео контентом" />
      </Helmet>

      <section className="lead page__section">
        <TitleH1 title="Видео" />
        {categories?.length > 1 && renderTagsContainder()}
      </section>

      <section className="main-card page__section">
        <CardVideoMain />
      </section>

      {isFiltersUsed ? <Loader isNested /> : renderMainContent()}

      {pageCount > 1 && (
        <Paginate
          sectionClass="page__section"
          pageCount={pageCount}
          value={pageNumber}
          onChange={setPageNumber}
        />
      )}
    </BasePage>
  );
};

export default Video;
