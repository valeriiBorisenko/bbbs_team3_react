import './QuestionsPage.scss';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
// import CurrentUserContext from '../../contexts/CurrentUserContext';
import TitleH1 from '../ui/TitleH1/TitleH1';
// import TitleH2 from '../ui/TitleH2/TitleH2';
import CardQuestion from '../ui/CardQuestion/CardQuestion';

import Api from '../../utils/api';

function QuestionsPage() {
  // const currentUser = useContext(CurrentUserContext);

  const [isQuestionsData, setIsQuestionsData] = useState([]);
  // const [isQuestionsTagsData, setIsQuestionsTagsData] = useState([]);
  // const [categoriesTags, SetCategoriesTags] = useState([]);

  useEffect(() => {
    Api.getQuestionsPageData()
      .then((res) => setIsQuestionsData(res.questionsData))
      .catch((err) => console.log(err));
  }, []);

  /* useEffect(() => {
      getQuestionsTagsData()
      .then((res) => {
        setIsQuestionsTagsData(res)

       const categoriesArr = res.map((tag) => tag.category);
        console.log('categoriesArr', categoriesArr);
        const set = new Set(categoriesArr);
        console.log('set', set);
        const uniqueCategories = Array.from(set);
        console.log('uniqueCategories', uniqueCategories);
        SetCategoriesTags(['Все', ...uniqueCategories]);
      })
      .catch((err) => console.log(err));
  }, [])
  */

  return (
    <>
      <Helmet>
        <title>Ответы на вопросы</title>
        <meta name="description" content="Страница с ответами на основные вопросы" />
      </Helmet>
      <section className="lead fade-in">
        <TitleH1 title="Ответы на вопросы" />
        <div className="tags tags_content_long-list">
          <ul className="tags__list tags__list_type_long">
            <li className="tags__list-item">
              <button className="button tags__button" type="button">Сложности</button>
            </li>
          </ul>
        </div>
        <ul className="questions page__section ">
          {isQuestionsData.map((data) => (
            <li>
              <CardQuestion
                key={data.id}
                data={data}
                sectionClass="card__questions_type_questions-page"
                isQuestionsPage
              />
            </li>
          ))}
        </ul>

      </section>
    </>
  );
}

export default QuestionsPage;

/*
  <section className="add-question page__section">
    <TitleH2
      sectionClass="add-question__title"
      title="Если вы не нашли ответ на свой вопрос — напишите нам, и мы включим его в список" />
    <form className="question-form">
      <fieldset className="question-form__add-question">
        <input className="question-form__input" type="text"
        name="question"
        value=""
        placeholder="Введите вопрос"
        required />
        <button
        className="button button_theme_light question-form__button"
        type="submit"
        name="submit"
        disabled>Отправить</button>
      </fieldset>
    </form>
  </section>
*/
