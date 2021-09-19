import {
  ARTICLES_TITLE,
  BOOKS_TITLE,
  CATALOG_TITLE,
  MAIN_PAGE_TITLE,
  MOVIES_TITLE,
  READ_AND_WATCH_TITLE,
  VIDEO_TITLE,
} from '../config/routes';

const readAndWatchPageTexts = {
  headTitle: `${MAIN_PAGE_TITLE} | ${READ_AND_WATCH_TITLE}`,
  headDescription: 'Превью основных публичных информационных разделов сайта.',
  pageTitles: {
    catalogTitle: CATALOG_TITLE,
    articlesTitle: ARTICLES_TITLE,
    moviesTitle: MOVIES_TITLE,
    videosTitle: VIDEO_TITLE,
    booksTitle: BOOKS_TITLE,
  },
  paragraphNoContent: 'В данной категории пока ничего нет.',
};

export default readAndWatchPageTexts;
