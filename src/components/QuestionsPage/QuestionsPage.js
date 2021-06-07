import './QuestionsPage.scss';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import TitleH1 from '../ui/TitleH1/TitleH1';
import TitleH2 from '../ui/TitleH2/TitleH2';
import CardQuestion from '../ui/CardQuestion/CardQuestion';
import PseudoButtonCheckbox from '../ui/PseudoButtonCheckbox/PseudoButtonCheckbox';

import Api from '../../utils/api';
import Input from '../ui/Input/Input';
import Button from '../ui/Button/Button';
// import Loader from '../ui/Loader/Loader';

function QuestionsPage() {
  const currentUser = useContext(CurrentUserContext);

  const [isQuestionsData, setIsQuestionsData] = useState([]);
  const [categoriesTags, setCategoriesTags] = useState([]);
  const [isInputValues, setIsInputValues] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Данный вопросов с сервера
  // комплектация тегов, относительно полученных тегов в вопросах
  useEffect(() => {
    Api.getQuestionsPageData()
      .then((res) => {
        setIsQuestionsData(res);
        const tagsArr = res.map((data) => data.tags);
        const tags = tagsArr.flat().map((data) => data.name);
        const newTags = new Set(tags);
        const uniqueTags = Array.from(newTags);
        setCategoriesTags(['Все', ...uniqueTags]);
      })
      .catch((err) => console.log(err));
  }, []);

  function tagsRender(tags, filterTags) {
    return tags.map((filterTagsName) => (
      <li className="tags__list-item" key={filterTagsName}>
        <PseudoButtonCheckbox
          type={filterTags}
          name="tag"
          value={filterTagsName}
          title={filterTagsName}
          filters={filterTagsName}
          // onChange={handleCheckboxChange}
          // onClick={handleCheckboxClick}
        />
      </li>
    ));
  }

  const onFormSubmit = (values) => {
    setIsInputValues({ ...isInputValues, ...values });
  };

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
        <ul className="questions">
          {isQuestionsData.map((data) => (
            <li key={data.id}>
              <CardQuestion
                data={data}
                sectionClass="card__questions_type_questions-page"
                isQuestionsPage
              />
            </li>
          ))}
        </ul>
        { currentUser && (
          <section className="add-question">
            <TitleH2
              sectionClass="add-question__title"
              title={isInputValues ? 'Спасибо! Мы приняли ваш вопрос' : 'Если вы не нашли ответ на свой вопрос — напишите нам, и мы включим его в список'}
            />
            <form className={`question-form ${isInputValues ? 'question-form_invisible' : ''}`} onSubmit={handleSubmit(onFormSubmit)}>
              <fieldset className="question-form__add-question">
                <Input
                  type="text"
                  name="question"
                  placeholder="Введите вопрос"
                  register={register}
                  required
                  error={errors?.question}
                  errorMessage="Введите вопрос*"
                  sectionClass="input__question-form"
                />
                <Button
                  title="Отправить"
                  color="black"
                  sectionClass="question-form__button"
                  isSubmittable
                  isDisabled={!!(errors.question)}
                />
              </fieldset>
            </form>
          </section>
        )}
      </section>
    </>
  );
}

export default QuestionsPage;
