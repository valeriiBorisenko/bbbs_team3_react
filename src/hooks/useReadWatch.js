/* eslint-disable no-shadow */
// /* eslint-disable import/named */
// /* eslint-disable no-unused-vars */
import { useState } from 'react';
// import CurrentUserContext from '../contexts/CurrentUserContext';
import getCatalogPageDatа from '../api/catalog-page';
// запрос видео
import { getVideoPageData } from '../api/videos-page';
// запрос статей
import getArticlesPageData from '../api/articles-page';
// запрос фильмов
import { getMoviesPageData } from '../api/movies-page';
// запрос книг
import { getBooksPageData } from '../api/books-page';

export default function useReadWatch(pageSize, pageNumber) {
  console.log('ХУККК');
  const offset = pageSize * pageNumber;
  const [catalogData, setCatalogData] = useState(null);
  const [videosData, setVideosData] = useState(null);
  const [articlesData, setArticlesData] = useState(null);
  const [moviesData, setMoviesData] = useState(null);
  const [booksData, setBooksData] = useState(null);
  const [pageCounter, setPageCounter] = useState(null);
  // const currentUser = useContext(CurrentUserContext);

  // function getCatalog() {
  //   getCatalogPageDatа({ limit, offset })
  //     .then((result) => console.log(result))
  //     .catch((error) => console.log(error));
  // }

  // function getMovies() {
  //   getMoviesPageData({ limit, offset })
  //     .then((result) => console.log(result))
  //     .catch((error) => console.log(error));
  // }

  // function getBooks() {
  //   getBooksPageData({ limit, offset })
  //     .then((result) => console.log(result))
  //     .catch((error) => console.log(error));
  // }

  // function getVideos() {
  //   getVideoPageData({ limit, offset })
  //     .then((result) => console.log(result))
  //     .catch((error) => console.log(error));
  // }

  // function getArticles() {
  //   getArticlesPageData({ limit, offset })
  //     .then((result) => console.log(result))
  //     .catch((error) => console.log(error));
  // }

  Promise.all([
    getCatalogPageDatа({ limit: pageSize, offset }),
    getMoviesPageData({ limit: pageSize, offset }),
    getBooksPageData({ limit: pageSize, offset }),
    getArticlesPageData({ limit: pageSize, offset }),
    getVideoPageData({ limit: pageSize, offset }),
  ]).then(([catalogs, movies, books, articles, videos]) => {
    console.log('THEN');
    // элементы массива это не массивы, а объекты вида:
    // count: 21, next: "", previous: null, results
    // из каждого нужно results и count

    console.log(movies);
    console.log(books);
    console.log(articles);
    setCatalogData(catalogs.results);
    setMoviesData(movies.results);
    setBooksData(books.results);
    setArticlesData(articles.results);
    setVideosData(videos.results);

    setPageCounter({
      catalogsTotalPages: Math.ceil(catalogs.count / pageSize),
      moviesTotalPages: Math.ceil(movies.count / pageSize),
      booksTotalPages: Math.ceil(books.count / pageSize),
      articlesTotalPages: Math.ceil(articles.count / pageSize),
      videosTotalPages: Math.ceil(videos.count / pageSize),
    });
  });

  // return {};
  return {
    catalogData,
    videosData,
    articlesData,
    moviesData,
    booksData,
    pageCounter,
  };
}
