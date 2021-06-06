import './QuestionsPage.scss';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
// import CurrentUserContext from '../../contexts/CurrentUserContext';
import TitleH1 from '../ui/TitleH1/TitleH1';
// import TitleH2 from '../ui/TitleH2/TitleH2';
import CardQuestion from '../ui/CardQuestion/CardQuestion';
import PseudoButtonCheckbox from '../ui/PseudoButtonCheckbox/PseudoButtonCheckbox';

import Api from '../../utils/api';

function QuestionsPage() {
  // const currentUser = useContext(CurrentUserContext);

  const [isQuestionsData, setIsQuestionsData] = useState([]);
  const [categoriesTags, SetCategoriesTags] = useState([]);

  useEffect(() => {
    Api.getQuestionsPageData()
      .then((res) => {
        setIsQuestionsData(res);
        const tagsArr = res.map((data) => data.tags);
        const tags = tagsArr.flat().map((data) => data.name);
        const set = new Set(tags);
        const uniqueCategories = Array.from(set);
        SetCategoriesTags(['Все', ...uniqueCategories]);
      })
      .catch((err) => console.log(err));
  }, []);

  function tagsRender(array, typeOfFilter) {
    return array.map((filterName) => (
      <li className="tags__list-item" key={filterName}>
        <PseudoButtonCheckbox
          type={typeOfFilter}
          name="categories"
          value={filterName}
          title={filterName}
          filters={filterName}
          // onChange={handleCheckboxChange}
          // onClick={handleCheckboxClick}
        />
      </li>
    ));
  }

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
            {tagsRender(categoriesTags, 'checkbox')}
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
