/* eslint-disable no-unused-vars */
import './Questions.scss';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import { useScrollToTop } from '../../hooks/index';
import { ALL_CATEGORIES } from '../../config/constants';
import { questionForm } from '../../utils/utils';
import {
  renderFilterTags,
  handleCheckboxBehavior,
  selectOneTag,
  deselectOneTag,
} from '../../utils/filter-tags';
import { BasePage, TitleH1, TitleH2, CardQuestion, Input, Button, Loader } from './index';
import Api from '../../utils/api';

function Questions() {
  useScrollToTop();

  const currentUser = useContext(CurrentUserContext);

  // начальная дата с API
  const [questionsData, setQuestionsData] = useState([]);

  // мутабельный массив для применения фильтров
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  // флаг применения фильтров
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);
  // категории фильтрации, состояние кнопок фильтров
  const [categories, setCategories] = useState([]);

  // форма
  const [isQuestionForm, setIsQuestionForm] = useState(questionForm.before);
  const [inputValues, setInputValues] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onFormSubmit = (values) => {
    setInputValues({ ...inputValues, ...values });
    setIsQuestionForm(questionForm.after);
    setTimeout(() => {
      setIsQuestionForm(questionForm.before);
    }, 10000);
  };

  // хэндлер клика по фильтру
  const changeCategory = (inputValue, isChecked) => {
    if (inputValue === ALL_CATEGORIES) {
      selectOneTag(setCategories, ALL_CATEGORIES);
    } else {
      handleCheckboxBehavior(setCategories, { inputValue, isChecked });
    }

    setIsFiltersUsed(true);
  };

  // фильтрация
  const handleFiltration = () => {
    const activeCategories = categories
      .filter((filter) => filter.isActive && filter.filter !== ALL_CATEGORIES)
      .map((filter) => filter.filter);

    if (activeCategories.length === 0) {
      setFilteredQuestions(questionsData);
      selectOneTag(setCategories, ALL_CATEGORIES);
    } else {
      const filterByCategory = questionsData.filter((question) =>
        question.tags.some((el) => activeCategories.includes(el.name)),
      );

      setFilteredQuestions(filterByCategory);
      deselectOneTag(setCategories, ALL_CATEGORIES);
    }
  };

  // запуск фильтрации
  useEffect(() => {
    handleFiltration();
    setIsFiltersUsed(false);
  }, [isFiltersUsed]);

  // API
  useEffect(() => {
    Api.getQuestionsPageData()
      .then((result) => {
        setQuestionsData(result);
        setFilteredQuestions(result);
        const tagsArr = result.map((data) => data.tags);
        const tags = tagsArr.flat().map((data) => data.name);
        const newTags = new Set(tags);
        const uniqueTags = Array.from(newTags).map((item) => ({
          filter: item,
          name: item,
          isActive: false,
        }));
        setCategories([
          { filter: ALL_CATEGORIES, name: ALL_CATEGORIES, isActive: true },
          ...uniqueTags,
        ]);
      })
      .catch(console.log);
  }, []);

  return (
    <BasePage>
      <Helmet>
        <title>Ответы на вопросы</title>
        <meta name="description" content="Страница с ответами на основные вопросы" />
      </Helmet>
      <section className="questions-page page__section fade-in">
        <TitleH1 title="Ответы на вопросы" />
        {questionsData.length > 0 ? (
          <>
            <div className="tags tags_content_long-list">
              <ul className="tags__list tags__list_type_long">
                {renderFilterTags(categories, 'tag', changeCategory)}
              </ul>
            </div>
            <ul className="questions">
              {filteredQuestions.map((data) => (
                <li className="questions__list-item fade-in" key={data.id}>
                  <CardQuestion
                    data={data}
                    sectionClass="card__questions_type_questions-page"
                    isQuestionsPage
                  />
                </li>
              ))}
            </ul>

            {currentUser && (
              <section className="add-question fade-in">
                <TitleH2 sectionClass="add-question__title" title={isQuestionForm.title} />
                <form
                  className={`question-form ${isQuestionForm.sectionClass}`}
                  onSubmit={handleSubmit(onFormSubmit)}
                >
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
                      isDisabled={!!errors.question}
                    />
                  </fieldset>
                </form>
              </section>
            )}
          </>
        ) : (
          <Loader isNested />
        )}
      </section>
    </BasePage>
  );
}

export default Questions;
