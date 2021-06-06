import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './QuestionsPage.scss';
import TitleH1 from '../ui/TitleH1/TitleH1';
import CardQuestion from '../ui/CardQuestion/CardQuestion';

import Api from '../../utils/api';

function QuestionsPage() {
  const [isQuestionsData, setIsQuestionsData] = useState([]);
  const [isQuestionsTagsData, setIsQuestionsTagsData] = useState([]);
  const [categoriesTags, SetCategoriesTags] = useState([]);

  useEffect(() => {
    Api.getQuestionsPageData()
      .then((res) => setIsQuestionsData(res.questionsData))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
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
  }, []);

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
