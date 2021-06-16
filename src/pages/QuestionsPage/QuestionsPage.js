import './QuestionsPage.scss';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import {
  CurrentUserContext,
  ALL_CATEGORIES,
  useSmoothScrollOnWindow,
  questionForm,
  renderFilterTags,
  changeCheckboxTagState,
  selectOneTag,
  deselectOneTag,
  BasePage,
  TitleH1,
  TitleH2,
  CardQuestion,
  Input,
  Button,
  Loader
} from './index';
import Api from '../../utils/api';

function QuestionsPage() {
  useSmoothScrollOnWindow({ top: 0 });

  const currentUser = useContext(CurrentUserContext);

  // начальная дата с API
  const [questionsData, setQuestionsData] = useState([]);

  // мутабельный массив для применения фильтров
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  // флаг применения фильтров
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);

  // категории фильтрации
  const [categories, setCategories] = useState([]); // состояние кнопок фильтров
  const [activeCategories, setActiveCategories] = useState(new Set()); // сами фильтры

  // форма
  const [isQuestionForm, setIsQuestionForm] = useState(questionForm.before);
  const [inputValues, setInputValues] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onFormSubmit = (values) => {
    setInputValues({ ...inputValues, ...values });
    setIsQuestionForm(questionForm.after);
    setTimeout(() => {
      setIsQuestionForm(questionForm.before);
    }, 10000);
  };

  // хэндлер клика по фильтру
  const changeCategory = (inputName, isChecked) => {
    changeCheckboxTagState(setCategories, { inputName, isChecked });

    if (inputName === ALL_CATEGORIES) {
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

  // фильтрация
  const handleFiltration = () => {
    if (activeCategories.size === 0) {
      setFilteredQuestions(questionsData);
      selectOneTag(setCategories, ALL_CATEGORIES);
      return;
    }

    // КАТЕГОРИИ
    if (activeCategories.size > 0) {
      const filterByCategory = questionsData
        .filter((question) => question.tags.some((el) => activeCategories.has(el.name)));
      setFilteredQuestions(filterByCategory);
    }
    deselectOneTag(setCategories, ALL_CATEGORIES);
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
        const uniqueTags = Array.from(newTags)
          .map((item) => ({ filter: item, name: item, isActive: false }));
        setCategories([
          { filter: ALL_CATEGORIES, name: ALL_CATEGORIES, isActive: true },
          ...uniqueTags
        ]);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <BasePage>
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
                  {renderFilterTags(categories, 'checkbox', changeCategory)}
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
    </BasePage>
  );
}

export default QuestionsPage;
