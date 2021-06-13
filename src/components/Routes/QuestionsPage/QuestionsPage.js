/* eslint-disable no-param-reassign */
import './QuestionsPage.scss';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import { useSmoothScrollOnWindow } from '../../../utils/custom-hooks';
import CurrentUserContext from '../../../contexts/CurrentUserContext';
import TitleH1 from '../../ui/TitleH1/TitleH1';
import TitleH2 from '../../ui/TitleH2/TitleH2';
import CardQuestion from '../../ui/CardQuestion/CardQuestion';
import PseudoButtonTag from '../../ui/PseudoButtonTag/PseudoButtonTag';
import Api from '../../../utils/api';
import Input from '../../ui/Input/Input';
import Button from '../../ui/Button/Button';
import Loader from '../../ui/Loader/Loader';
import { questionForm } from '../../../utils/utils';

function QuestionsPage() {
  useSmoothScrollOnWindow({ top: 0 });

  const currentUser = useContext(CurrentUserContext);

  const [questionsData, setQuestionsData] = useState([]);

  // мутабельный массив для применения фильтров
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);

  const [categories, setCategories] = useState([]);
  const [activeCategories, setActiveCategories] = useState(new Set());

  // форма
  const [isQuestionForm, setIsQuestionForm] = useState(questionForm.before);
  const [inputValues, setInputValues] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const changeCategory = (inputName, isChecked) => {
    setCategories((stateFilters) => stateFilters.map((filter) => {
      if (filter.filter === inputName) {
        filter.isActive = isChecked;
      }
      return filter;
    }));

    if (inputName === 'Все') {
      setActiveCategories(new Set());
      setIsFiltersUsed(true);
      return;
    }

    // если такой фильтр уже есть
    if (activeCategories.has(inputName)) {
      setActiveCategories((set) => {
        set.delete(inputName);
        return set;
      });
      setIsFiltersUsed(true);
      return;
    }

    // новый фильтр
    setIsFiltersUsed(true);
    setActiveCategories((set) => {
      set.add(inputName);
      return set;
    });
  };

  function handleFiltration() {
    if (activeCategories.size === 0) {
      setFilteredQuestions(questionsData);
      // смена цвета и состояния чекбокса 'Все'
      setCategories((stateFilters) => stateFilters.map((filter) => {
        if (filter.filter === 'Все') {
          filter.isActive = true;
        } else {
          filter.isActive = false;
        }
        return filter;
      }));
      return;
    }

    // КАТЕГОРИИ
    if (activeCategories.size > 0) {
      const filterByCategory = questionsData
        .filter((question) => question.tags.some((el) => activeCategories.has(el.name)));
      setFilteredQuestions(filterByCategory);
    }
    setCategories((stateFilters) => stateFilters.map((filter) => {
      if (filter.filter === 'Все') {
        filter.isActive = false;
      }
      return filter;
    }));
  }

  useEffect(() => {
    handleFiltration();
    setIsFiltersUsed(false);
  }, [isFiltersUsed]);

  // Данный вопросов с сервера
  // комплектация тегов, относительно полученных тегов в вопросах
  useEffect(() => {
    Api.getQuestionsPageData()
      .then((result) => {
        setQuestionsData(result);
        setFilteredQuestions(result);
        const tagsArr = result.map((data) => data.tags);
        const tags = tagsArr.flat().map((data) => data.name);
        const newTags = new Set(tags);
        const uniqueTags = Array.from(newTags).map((item) => ({ filter: item, isActive: false }));
        setCategories([
          { filter: 'Все', isActive: true },
          ...uniqueTags
        ]);
      })
      .catch((err) => console.log(err));
  }, []);

  function renderSomeFilters(filterList, type, handleCheckboxClick) {
    return filterList.map((item) => (
      <li className="tags__list-item" key={item.filter}>
        <PseudoButtonTag
          type={type}
          name="categories"
          value={item.filter}
          title={item.filter}
          isActive={item.isActive}
          onClick={handleCheckboxClick}
        />
      </li>
    ));
  }

  const onFormSubmit = (values) => {
    setInputValues({ ...inputValues, ...values });
    setIsQuestionForm(questionForm.after);
    setTimeout(() => {
      setIsQuestionForm(questionForm.before);
    }, 10000);
  };

  return (
    <>
      <Helmet>
        <title>Ответы на вопросы</title>
        <meta name="description" content="Страница с ответами на основные вопросы" />
      </Helmet>
      <section className="questions-page page__section fade-in">
        <TitleH1 title="Ответы на вопросы" />
        {questionsData.length > 0
          ? (
            <>
              <div className="tags tags_content_long-list">
                <ul className="tags__list tags__list_type_long">
                  {renderSomeFilters(categories, 'checkbox', changeCategory)}
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
                <TitleH2
                  sectionClass="add-question__title"
                  title={isQuestionForm.title}
                />
                <form className={`question-form ${isQuestionForm.sectionClass}`} onSubmit={handleSubmit(onFormSubmit)}>
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
            </>
          ) : <Loader isNested />}
      </section>
    </>
  );
}

export default QuestionsPage;
