import readAndWatchPageTexts from './locales/read-and-watch-page-RU';
import {
  ARTICLES_URL,
  BOOKS_URL,
  CATALOG_URL,
  MOVIES_URL,
  VIDEO_URL,
} from '../../config/routes';
import {
  MAX_SCREEN_WIDTH,
  PAGE_SIZE_PAGINATE,
  RAW_DELAY_SLIDER_TRANSITION,
  RAW_SLIDER_PADDINGS,
} from './constants';
import { usePageWidth } from '../../hooks';
// АПИ
import { getCatalogPageData } from '../../api/catalog-page';
import { getVideoPageData } from '../../api/video-page';
import { getArticlesPageData } from '../../api/articles-page';
import { getMoviesPageData } from '../../api/movies-page';
import { getBooksPageData } from '../../api/books-page';
import {
  BasePage,
  CardArticle,
  CardBook,
  CardCatalog,
  CardFilm,
  ReadAndWatchSection,
} from './index';
import './ReadAndWatch.scss';

// константы страницы
const { headTitle, headDescription, pageTitles, paragraphNoContent } =
  readAndWatchPageTexts;
const { catalogTitle, articlesTitle, moviesTitle, videosTitle, booksTitle } =
  pageTitles;

function ReadAndWatch() {
  // определяет сколько объектов показывать в ряду
  const pageSize = usePageWidth(MAX_SCREEN_WIDTH, PAGE_SIZE_PAGINATE);

  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      <section className="readwatch-page page__section fade-in">
        {pageSize && renderUniqueSliderSections()}
      </section>
    </BasePage>
  );

  function renderUniqueSliderSections() {
    return (
      <>
        <ReadAndWatchSection
          breakpoints={MAX_SCREEN_WIDTH}
          elemPaddings={RAW_SLIDER_PADDINGS}
          transitionDelay={RAW_DELAY_SLIDER_TRANSITION}
          paragraphNoContentText={paragraphNoContent}
          pageSize={pageSize}
          getDataFromApi={getCatalogPageData}
          CardTemplateComponent={CardCatalog}
          path={CATALOG_URL}
          sectionTitle={catalogTitle}
          sectionClass="readwatch-page__slider-container_el_catalog"
        />
        <ReadAndWatchSection
          breakpoints={MAX_SCREEN_WIDTH}
          elemPaddings={RAW_SLIDER_PADDINGS}
          transitionDelay={RAW_DELAY_SLIDER_TRANSITION}
          paragraphNoContentText={paragraphNoContent}
          pageSize={pageSize}
          getDataFromApi={getVideoPageData}
          CardTemplateComponent={CardFilm}
          path={VIDEO_URL}
          sectionTitle={videosTitle}
          sectionClass="readwatch-page__slider-container_el_video"
          isVideo
        />
        <ReadAndWatchSection
          breakpoints={MAX_SCREEN_WIDTH}
          elemPaddings={RAW_SLIDER_PADDINGS}
          transitionDelay={RAW_DELAY_SLIDER_TRANSITION}
          paragraphNoContentText={paragraphNoContent}
          pageSize={pageSize}
          getDataFromApi={getArticlesPageData}
          CardTemplateComponent={CardArticle}
          path={ARTICLES_URL}
          sectionTitle={articlesTitle}
          sectionClass="readwatch-page__slider-container_el_articles"
        />
        <ReadAndWatchSection
          breakpoints={MAX_SCREEN_WIDTH}
          elemPaddings={RAW_SLIDER_PADDINGS}
          transitionDelay={RAW_DELAY_SLIDER_TRANSITION}
          paragraphNoContentText={paragraphNoContent}
          pageSize={pageSize}
          getDataFromApi={getMoviesPageData}
          CardTemplateComponent={CardFilm}
          path={MOVIES_URL}
          sectionTitle={moviesTitle}
          sectionClass="readwatch-page__slider-container_el_movies"
        />
        <ReadAndWatchSection
          breakpoints={MAX_SCREEN_WIDTH}
          elemPaddings={RAW_SLIDER_PADDINGS}
          transitionDelay={RAW_DELAY_SLIDER_TRANSITION}
          paragraphNoContentText={paragraphNoContent}
          pageSize={pageSize}
          getDataFromApi={getBooksPageData}
          CardTemplateComponent={CardBook}
          path={BOOKS_URL}
          sectionTitle={booksTitle}
          sectionClass="readwatch-page__slider-container_el_books"
        />
      </>
    );
  }
}

export default ReadAndWatch;
