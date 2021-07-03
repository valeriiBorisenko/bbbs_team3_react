/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import './ReadAndWatchSection.scss';
import { Link } from 'react-router-dom';

import {
  // BasePage,
  // Loader,
  TitleH3,
  CardCatalog,
  CardArticle,
  CardFilm,
  // CardsSectionWithLines,
  // AnimatedPageContainer,
} from './index';

function ReadAndWatchSection({ sectionTitle, path, data, handleCardClick }) {
  return (
    <section className="raw__section">
      <div className="readwatch">
        <TitleH3 />
        {/* в тайтл надо как то положить эту линку! */}
        <Link className="readwatch__heading" to={path}>
          {sectionTitle}
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

      {/* список карточек для Справочника */}
      {sectionTitle === 'Справочник' && (
        <ul className="guide">{currentPageData}</ul>
      )}

      {/* список карточек для Видео */}
      {sectionTitle === 'Видео' && (
        <ul className="movies">{currentPageData}</ul>
      )}

      {/* список карточек для Статей */}
      {sectionTitle === 'Статьи' && (
        <section className="events-grid events-grid_place_raw">
          {currentPageData}
        </section>
      )}

      {/* список карточек для Фильмов */}
      {sectionTitle === 'Фильмы' && (
        <ul className="movies">{currentPageData}</ul>
      )}

      {/* список карточек для Книг */}
      {sectionTitle === 'Книги' && <ul className="books">{currentPageData}</ul>}
    </section>
  );
}

ReadAndWatchSection.propTypes = {
  sectionTitle: PropTypes.string.isRequired,
  path: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  handleCardClick: PropTypes.func,
};

ReadAndWatchSection.defaultProps = {
  path: '',
  handleCardClick: () => {},
};

export default ReadAndWatchSection;
