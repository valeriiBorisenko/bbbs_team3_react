/* eslint-disable react/jsx-props-no-spreading */
// /* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import PropTypes from 'prop-types';
import './ReadAndWatchSection.scss';
import { Link } from 'react-router-dom';
import { TitleH3, CardCatalog, CardArticle, CardFilm, CardBook } from './index';

// CardFilm - и для видео и для фильмов!!

function ReadAndWatchSection({
  sectionTitle,
  path,
  data,
  getData,
  setData,
  handleCardClick,
  elementsPerSection,
}) {
  console.log(data);
  return (
    <section>
      <div className="readwatch__container">
        <Link className="readwatch__heading-link" to={path}>
          <TitleH3 title={sectionTitle} sectionClass="readwatch__heading" />
        </Link>
        <button type="button">вперед</button>
        <button type="button">назад</button>

        {/* <ReactPaginate
          pageCount={pageCount}
          marginPagesDisplayed={0}
          pageRangeDisplayed={perPage}
          containerClassName="readwatch__pagination"
          previousClassName="readwatch__back"
          nextClassName="readwatch__forward"
          previousLinkClassName="readwatch__back-link"
          nextLinkClassName="readwatch__forward-link"
          nextLabel=""
          previousLabel=""
          onPageChange={handlePageClick}
        /> */}
      </div>

      {/* список карточек для Справочника */}
      {/* {sectionTitle === 'Справочник' && (
        <ul className="readwatch__item-grid">{currentSectionData}</ul>
      )} */}

      {/* список карточек для Видео */}
      {/* {sectionTitle === 'Видео' && (
        <ul className="movies">{currentSectionData}</ul>
      )} */}

      {/* список карточек для Статей */}
      {/* {sectionTitle === 'Статьи' && (
        <section className="events-grid events-grid_place_raw">
          {currentSectionData}
        </section>
      )} */}

      {/* список карточек для Фильмов */}
      {/* {sectionTitle === 'Фильмы' && (
        <ul className="readwatch__item-grid">{currentSectionData}</ul>
      )} */}

      {/* список карточек для Книг */}
      {/* {sectionTitle === 'Книги' && (
        <ul className="readwatch__item-grid">{currentSectionData}</ul>
      )} */}
    </section>
  );
}

ReadAndWatchSection.propTypes = {
  sectionTitle: PropTypes.string.isRequired,
  path: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  getData: PropTypes.func,
  setData: PropTypes.func,
  handleCardClick: PropTypes.func,
  elementsPerSection: PropTypes.number.isRequired,
};

ReadAndWatchSection.defaultProps = {
  path: '',
  getData: () => {},
  setData: () => {},
  handleCardClick: () => {},
};

export default ReadAndWatchSection;

// как заполнять компоненты карточек
/*
* каталог
<CardCatalog title="" shape="" image="" sectionClass="" />
* статья
<CardArticle data="" color="" sectionClass="" />
* фильмы
<CardFilm data="" handleClick="" children="" />
* видео
<CardFilm data="" handleClick="" children="" />
* книги
<CardBook data="" />
*/
