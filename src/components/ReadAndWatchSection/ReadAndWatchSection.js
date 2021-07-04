/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import PropTypes from 'prop-types';
import './ReadAndWatchSection.scss';
import { Link } from 'react-router-dom';
import { TitleH3, CardCatalog, CardArticle, CardFilm } from './index';

function ReadAndWatchSection({
  sectionTitle,
  path,
  data,
  handleCardClick,
  elementsPerSection,
}) {
  return (
    <section>
      <div className="readwatch__container">
        <Link className="readwatch__heading-link" to={path}>
          <TitleH3 title={sectionTitle} sectionClass="readwatch__heading" />
        </Link>

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

      <ul className="readwatch__item-grid">
        <li>
          <div className="card-catalog cards-section__item">
            <div className="card-figure card-figure_color_yellow card-figure_form_circle card-catalog_type_shaped">
              <img
                className="card-catalog__image"
                src="https://picsum.photos/870/520"
                alt="Дети"
              />
            </div>
            <h2 className="section-title card-catalog__title">Дети</h2>
          </div>
        </li>
        <li>
          <div className="card-catalog cards-section__item">
            <div className="card-figure card-figure_color_yellow card-figure_form_circle card-catalog_type_shaped">
              <img
                className="card-catalog__image"
                src="https://picsum.photos/870/520"
                alt="Дети"
              />
            </div>
            <h2 className="section-title card-catalog__title">Дети</h2>
          </div>
        </li>
        <li>
          <div className="card-catalog cards-section__item">
            <div className="card-figure card-figure_color_yellow card-figure_form_circle card-catalog_type_shaped">
              <img
                className="card-catalog__image"
                src="https://picsum.photos/870/520"
                alt="Дети"
              />
            </div>
            <h2 className="section-title card-catalog__title">Дети</h2>
          </div>
        </li>
        <li>
          <div className="card-catalog cards-section__item">
            <div className="card-figure card-figure_color_yellow card-figure_form_circle card-catalog_type_shaped">
              <img
                className="card-catalog__image"
                src="https://picsum.photos/870/520"
                alt="Дети"
              />
            </div>
            <h2 className="section-title card-catalog__title">Дети</h2>
          </div>
        </li>
      </ul>
      {/* список карточек для Справочника */}
      {/* {sectionTitle === 'Справочник' && (
        <ul className="guide">{currentPageData}</ul>
      )} */}

      {/* список карточек для Видео */}
      {/* {sectionTitle === 'Видео' && (
        <ul className="movies">{currentPageData}</ul>
      )} */}

      {/* список карточек для Статей */}
      {/* {sectionTitle === 'Статьи' && (
        <section className="events-grid events-grid_place_raw">
          {currentPageData}
        </section>
      )} */}

      {/* список карточек для Фильмов */}
      {/* {sectionTitle === 'Фильмы' && (
        <ul className="movies">{currentPageData}</ul>
      )} */}

      {/* список карточек для Книг */}
      {/* {sectionTitle === 'Книги' && <ul className="books">{currentPageData}</ul>} */}
    </section>
  );
}

ReadAndWatchSection.propTypes = {
  sectionTitle: PropTypes.string.isRequired,
  path: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  handleCardClick: PropTypes.func,
  elementsPerSection: PropTypes.number.isRequired,
};

ReadAndWatchSection.defaultProps = {
  path: '',
  handleCardClick: () => {},
};

export default ReadAndWatchSection;
