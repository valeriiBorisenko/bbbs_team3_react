/* eslint-disable no-shadow */
// /* eslint-disable import/named */
// /* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
// import CurrentUserContext from '../contexts/CurrentUserContext';
import getCatalogPageData from '../api/catalog-page';
import { getBooksPageData } from '../api/books-page';
import { getMoviesPageData } from '../api/movies-page';
// // import {  } from '../api/books-page';
// // import {  } from '../api/books-page';

export default function useReadWatch({ limit, offset }) {
  // const [catalogData, setCatalogData] = useState([]);
  // const [videosData, setVideosData] = useState([]);
  // const [articlesData, setArticlesData] = useState([]);
  // const [moviesData, setMoviesData] = useState([]);
  // const [booksData, setBooksData] = useState([]);
  // const currentUser = useContext(CurrentUserContext);

  function getCatalog({ limit, offset }) {
    getCatalogPageData({ limit, offset })
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  }

  function getMovies({ limit, offset }) {
    getMoviesPageData({ limit, offset })
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  }

  function getBooks({ limit, offset }) {
    getBooksPageData({ limit, offset })
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    Promise.all([
      getCatalogPageData({ limit, offset }),
      // Api.getVideos(),
      // Api.getArticles(),
      getMoviesPageData({ limit, offset }),
      getBooksPageData({ limit, offset }),
    ])
      .then(([materials, movies, books]) => {
        // setCatalogData(materials);
        // Неавторизованный пользователь не видит видео с тегом "Ресурсная группа"
        // setVideosData(
        //   videos.filter(
        //     ({ tag }) => currentUser || !currentUser === (tag.name !== 'Ресурсная группа')
        //   )
        // );
        // setArticlesData(articles);
        // setMoviesData(movies);
        // setBooksData(books);
      })
      .catch(console.log);
  }, []);

  return { getCatalog, getMovies };
  // return { catalogData, videosData, articlesData, moviesData, booksData };
}
