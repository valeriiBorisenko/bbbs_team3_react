import './Questions.scss';
import { useContext, useEffect, useState } from 'react';
import questionsPageTexts from '../../locales/questions-page-RU';
import { CurrentUserContext, ErrorsContext } from '../../contexts/index';
import {
  useScrollToTop,
  useDebounce,
  useFormWithValidation,
} from '../../hooks/index';
import {
  ALL_CATEGORIES,
  DELAY_DEBOUNCE,
  ERROR_CODES,
} from '../../config/constants';
import { questionForm, changeCaseOfFirstLetter } from '../../utils/utils';
import {
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
  AnimatedPageContainer,
  TagsList,
} from './index';
import {
  getQuestionsPageData,
  getQuestionsPageTags,
  postQuestion,
} from '../../api/questions-page';

const {
  headTitle,
  headDescription,
  title,
  textStubNoData,
  formPlaceholder,
  formSubmitButton,
  loadMoreButton,
} = questionsPageTexts;

function Questions() {
  useScrollToTop();

  const { currentUser } = useContext(CurrentUserContext);
  const { serverError, setError, clearError } = useContext(ErrorsContext);
  const { unauthorized, badRequest } = ERROR_CODES;

  const errorsString = serverError
    ? Object.values(serverError)
        .map((err) => err)
        .join(' ')
        .trim()
    : '';

  // крутилка-лоадер
  const [isLoading, setIsLoading] = useState(false);
  //! крутилка на дозагрузку даты
  //! const [isMoreDataLoading, setIsMoreDataLoading] = useState(false);
  // начальная дата с API
  const [questionsPageData, setQuestionsPageData] = useState(null);
  // кол-во вопросов сразу и в до-загрузке
  const pageSize = 10;
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(null);
  console.log(totalPages);

  // флаг применения фильтров
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);
  // категории фильтрации, состояние кнопок фильтров
  const [categories, setCategories] = useState(null);

  // форма
  const [questionFormState, setQuestionFormState] = useState(
    questionForm.beforeSubmit
  );
  // валидация
  const { values, handleChange, errors, isValid, resetForm } =
    useFormWithValidation();

  // форма вопросов
  const setFormState = (isError) => {
    if (isError) {
      // форму не чистим!
      setQuestionFormState(questionForm.errorSubmit);
    } else {
      setQuestionFormState(questionForm.successSubmit);
      // вернулись к изначальной
      setTimeout(() => {
        resetForm();
        clearError();
        setQuestionFormState(questionForm.beforeSubmit);
      }, 4000);
    }
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const { question } = values;
    postQuestion({ title: question })
      .then(() => setFormState(false))
      .catch((err) => {
        if (err?.status === badRequest || err?.status === unauthorized)
          setError(err?.data);
        else setFormState(true);
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

    // то есть активных нету и сейчас нажато "ВСЕ"
    if (activeCategories.length === 0) {
      const offset = pageSize * pageIndex;
      getQuestionsPageData({ limit: pageSize, offset })
        .then((allQuestions) => {
          setQuestionsPageData(allQuestions.results);
        })
        .catch((error) => console.log(error))
        .finally(() => setIsLoading(false));

      selectOneTag(setCategories, ALL_CATEGORIES);
    } else {
      const query = activeCategories.join();
      getQuestionsPageData({ tags: query })
        .then((filteredQuestions) =>
          setQuestionsPageData(filteredQuestions.results)
        )
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

  // API, первая загрузка
  useEffect(() => {
    const offset = pageSize * pageIndex;
    Promise.all([
      getQuestionsPageData({ limit: pageSize, offset }),
      getQuestionsPageTags(),
    ])
      .then(([questionsData, tagsFilters]) => {
        const { results, count } = questionsData;

        setTotalPages(Math.ceil(count / pageSize));
        setQuestionsPageData(results);

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
  // заглушка, если нет даты
  function returnAnimatedContainer() {
    return <AnimatedPageContainer titleText={textStubNoData} />;
  }

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
          onSubmit={(evt) => handleSubmit(evt)}
          noValidate
        >
          <fieldset className="question-form__add-question">
            <Input
              id="questionsFormInput"
              type="text"
              name="question"
              placeholder={formPlaceholder}
              onChange={handleChange}
              value={values?.question}
              minLength="10"
              maxLength="200"
              required
              error={errors?.question}
              sectionClass="input__question-form"
            />
            <Button
              title={formSubmitButton}
              color="black"
              sectionClass="question-form__button"
              isSubmittable
              isDisabled={!isValid}
            />
          </fieldset>
          <span className="form-error-message">{errorsString}</span>
        </form>
      </section>
    </>
  );

  // эффект подгрузки доп данных
  useEffect(() => {
    if (pageIndex !== 0) {
      const offset = pageSize * pageIndex;
      getQuestionsPageData({ limit: pageSize, offset })
        .then((questionsData) => {
          const { results } = questionsData;
          setQuestionsPageData((prevData) => [...prevData, ...results]);
        })
        .catch((error) => console.log(error));
    }
  }, [pageIndex]);

  const renderLoadMoreButton = () => {
    if (questionsPageData.length >= 10) {
      return (
        <Button
          title={loadMoreButton}
          onClick={() => setPageIndex((prevIndex) => prevIndex + 1)}
          sectionClass="load-more-button"
        />
      );
    }

    return null;
  };

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

  // главная функция рендеринга
  const renderPageContent = () => {
    if (questionsPageData.length > 0) {
      return (
        <>
          <TitleH1 title={title} sectionClass="questions__title" />

          {/* рендер фильтров */}
          {categories?.length > 1 && (
            <TagsList
              filterList={categories}
              name="tag"
              handleClick={changeCategory}
            />
          )}

          {/* рендерим сами вопросы */}
          {isLoading ? <Loader isNested /> : renderQuestionsContainer()}

          {questionsPageData.length >= 10 ? renderLoadMoreButton() : null}
          {/* если залогинен рендерим форму */}
          {currentUser && renderQuestionForm()}
        </>
      );
    }

    // залогинен и нет вопросов, покажем заглушку
    const isDataForPage = questionsPageData.length > 1;
    if (!isDataForPage) {
      return returnAnimatedContainer();
    }

    return null;
  };

  // глобальный лоадер
  if (!questionsPageData || !categories) {
    return <Loader isCentered />;
  }

  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      <section className="questions-page page__section fade-in">
        {renderPageContent()}
      </section>
    </BasePage>
  );
}

export default Questions;

//! загрузить еще
// 1. пропс isDisabled будет смотреть на стейт "осталось ли еще даты?"
// 2. дебаунс на кнопку
// 3. если у тебя офсет =8, а элементов всего сейчас 7, то кнопку надо или удалять или закрашивать серым
//* 4. показывать кнопку ОТ определенного количества элементов на странице (от 10 штук)
