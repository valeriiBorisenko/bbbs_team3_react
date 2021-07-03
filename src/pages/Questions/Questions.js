/* eslint-disable no-unused-vars */
import './Questions.scss';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import { useScrollToTop, useDebounce } from '../../hooks/index';
import { ALL_CATEGORIES, DELAY_DEBOUNCE } from '../../config/constants';
import { questionForm, changeCaseOfFirstLetter } from '../../utils/utils';
import {
  renderFilterTags,
  handleCheckboxBehavior,
  selectOneTag,
  deselectOneTag,
} from '../../utils/filter-tags';
import {
  BasePage,
  TitleH1,
  TitleH2,
  CardQuestion,
  Input,
  Button,
  Loader,
} from './index';
import {
  getQuestionsPageData,
  getQuestionsPageTags,
  getQuestionsByFilters,
  postQuestion,
} from '../../api/questions-page';

function Questions() {
  useScrollToTop();

  const { currentUser } = useContext(CurrentUserContext);
  // крутилка-лоадер
  const [isLoading, setIsLoading] = useState(false);
  // начальная дата с API
  const [questionsPageData, setQuestionsPageData] = useState(null);

  // флаг применения фильтров
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);
  // категории фильтрации, состояние кнопок фильтров
  const [categories, setCategories] = useState(null);

  // форма
  const [questionFormState, setQuestionFormState] = useState(
    questionForm.beforeSubmit
  );

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const setFormState = (isError) => {
    if (isError) {
      setQuestionFormState(questionForm.errorSubmit);
    }

    // успешная надпись
    setQuestionFormState(questionForm.successSubmit);
    // почистили форму
    reset({ question: '' });
    // вернулись к изначальной
    setTimeout(() => {
      setQuestionFormState(questionForm.beforeSubmit);
    }, 4000);
  };

  const onFormSubmit = (values) => {
    const { question } = values;
    postQuestion({ title: question })
      .then(() => {
        setFormState(false);
      })
      .catch(() => {
        setFormState(true);
      });
  };

  // хэндлер клика по фильтру
  const changeCategory = (inputValue, isChecked) => {
    if (inputValue === ALL_CATEGORIES) {
      selectOneTag(setCategories, ALL_CATEGORIES);
    } else {
      handleCheckboxBehavior(setCategories, { inputValue, isChecked });
    }
    setIsLoading(true);
    setIsFiltersUsed(true);
  };

  // фильтрация
  const handleFiltration = () => {
    const activeCategories = categories
      .filter((filter) => filter.isActive && filter.filter !== ALL_CATEGORIES)
      .map((filter) => filter.filter);
    // массив вида ["children", "relationship-termination"]
    console.log(activeCategories);

    // то есть активных нету и сейчас нажато "ВСЕ"
    if (activeCategories.length === 0) {
      console.log('TYT');
      getQuestionsPageData()
        .then((allQuestions) => {
          console.log('TYT2');
          setQuestionsPageData(allQuestions);
        })
        .catch((error) => console.log(error))
        .finally(() => setIsLoading(false));

      selectOneTag(setCategories, ALL_CATEGORIES);
    } else {
      const query = activeCategories.join();
      getQuestionsByFilters(query)
        .then((filteredQuestions) => setQuestionsPageData(filteredQuestions))
        .catch((error) => console.log(error))
        .finally(() => setIsLoading(false));

      deselectOneTag(setCategories, ALL_CATEGORIES);
    }
  };

  // запуск фильтрации
  const debounceFiltration = useDebounce(handleFiltration, DELAY_DEBOUNCE);
  useEffect(() => {
    if (isFiltersUsed) {
      debounceFiltration();
    }
    setIsFiltersUsed(false);
  }, [isFiltersUsed]);

  // API
  useEffect(() => {
    Promise.all([getQuestionsPageData(), getQuestionsPageTags()])
      .then(([questionsData, tagsFilters]) => {
        console.log('TYT3');
        setQuestionsPageData(questionsData);

        const customFilters = tagsFilters.map((tag) => {
          const filterName = changeCaseOfFirstLetter(tag.name);
          return {
            isActive: false,
            name: filterName,
            filter: tag.slug,
          };
        });
        setCategories([
          { filter: ALL_CATEGORIES, name: ALL_CATEGORIES, isActive: true },
          ...customFilters,
        ]);
      })
      .catch((error) => console.log(error));
  }, []);

  // рендеринг
  // форма вопросов
  const renderQuestionForm = () => (
    <>
      <section className="add-question fade-in">
        <TitleH2
          sectionClass={`add-question__title ${questionFormState.titleClass}`}
          title={questionFormState.title}
        />
        <form
          className={`question-form ${questionFormState.formVisibilityClass}`}
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
    </>
  );

  // контейнер с вопросами
  const renderQuestionsContainer = () => (
    <ul className="questions">
      {questionsPageData.map((question) => (
        <li className="questions__list-item fade-in" key={question.id}>
          <CardQuestion
            data={question}
            sectionClass="card__questions_type_questions-page"
            isQuestionsPage
          />
        </li>
      ))}
    </ul>
  );

  // контейнер фильтров
  const renderTagsContainer = () => (
    <div className="tags tags_content_long-list">
      <ul className="tags__list tags__list_type_long">
        {renderFilterTags(categories, 'tag', changeCategory)}
      </ul>
    </div>
  );

  // главная функция рендеринга
  const renderPageContent = () => {
    if (questionsPageData.length > 0) {
      return (
        <>
          <TitleH1 title="Ответы на вопросы" />

          {/* рендер фильтров */}
          {categories?.length > 1 && renderTagsContainer()}

          {/* рендерим сами вопросы */}
          {isLoading ? <Loader isNested /> : renderQuestionsContainer()}
          {/* {renderQuestionsContainer()} */}

          {/* если залогинен рендерим форму */}
          {currentUser && renderQuestionForm()}
        </>
      );
    }

    return null;
  };

  // глобальный лоадер
  if (!questionsPageData || !categories) {
    return <Loader isCentered />;
  }

  return (
    <BasePage>
      <Helmet>
        <title>Ответы на вопросы</title>
        <meta
          name="description"
          content="Страница с ответами на основные вопросы"
        />
      </Helmet>
      <section className="questions-page page__section fade-in">
        {renderPageContent()}
      </section>
    </BasePage>
  );
}

export default Questions;
