import './Questions.scss';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import questionsPageTexts from '../../locales/questions-page-RU';
import {
  CurrentUserContext,
  ErrorsContext,
  PopupsContext,
} from '../../contexts/index';
import { useDebounce, useFormWithValidation } from '../../hooks/index';
import {
  ALL_CATEGORIES,
  DELAY_DEBOUNCE,
  ERROR_CODES,
  ERROR_MESSAGES,
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
} = questionsPageTexts;

const validationSettings = {
  question: {
    minLength: 10,
    maxLength: 200,
  },
};

function Questions() {
  const { currentUser } = useContext(CurrentUserContext);
  const { serverError, setError, clearError } = useContext(ErrorsContext);
  const { openPopupError } = useContext(PopupsContext);

  const { unauthorized, badRequest } = ERROR_CODES;
  const [isPageError, setIsPageError] = useState(false);

  const errorsString = serverError
    ? Object.values(serverError)
        .map((err) => err)
        .join(' ')
        .trim()
    : '';

  // определение редиректа с Главной, чтобы показать выбранный вопрос
  const { state } = useLocation();
  const chosenQuestion = state?.question;

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
    // выбираем кнопку все
    if (inputValue === ALL_CATEGORIES) {
      selectOneTag(setCategories, ALL_CATEGORIES);
    } else {
      // выбираем другие фильтры
      handleCheckboxBehavior(setCategories, { inputValue, isChecked });
    }
    setIsLoading(true);
    setIsFiltersUsed(true);
  };

  // фильтрация
  const getActiveCategories = () => {
    if (!categories) {
      // обязательно возвращаем пустой массив, т.к смотрим на длину либо делаем join()
      return [];
    }

    return categories
      .filter((filter) => filter.isActive && filter.filter !== ALL_CATEGORIES)
      .map((filter) => filter.filter);
  };

  const getFiltratedQuestions = ({ limit, offset, tags }) => {
    getQuestionsPageData({ limit, offset, tags })
      .then((questionsData) => {
        const { results } = questionsData;

        setQuestionsPageData(results);
      })
      .catch(() => {
        setError({
          title: ERROR_MESSAGES.filterErrorMessage.title,
          button: ERROR_MESSAGES.filterErrorMessage.button,
        });
        openPopupError();
      })
      .finally(() => setIsLoading(false));
  };

  const handleFiltration = (activeCategories) => {
    // активных фильтров нету и сейчас нажали "ВСЕ"
    if (activeCategories.length === 0) {
      getFiltratedQuestions({ limit: 10, offset: 0 });
      selectOneTag(setCategories, ALL_CATEGORIES);
    } else {
      // выбрана какая то категория
      const query = activeCategories.join();
      getFiltratedQuestions({ tags: query });
      deselectOneTag(setCategories, ALL_CATEGORIES);
    }
  };

  // запуск фильтрации
  const debounceFiltration = useDebounce(handleFiltration, DELAY_DEBOUNCE);
  useEffect(() => {
    // используем фильтры (2 варианта развития внутри)
    if (isFiltersUsed) {
      const activeCategories = getActiveCategories();
      debounceFiltration(activeCategories);
    }

    // провели фильтрацию, флажок фильтров меняем
    setIsFiltersUsed(false);
  }, [isFiltersUsed]);

  // API, первая загрузка
  useEffect(() => {
    Promise.all([
      getQuestionsPageData({ limit: 10, offset: 0 }),
      getQuestionsPageTags(),
    ])
      .then(([questionsData, tagsFilters]) => {
        const { results } = questionsData;

        setQuestionsPageData(results);

        const customFilters = tagsFilters.map((tag) => {
          const filterName = changeCaseOfFirstLetter(tag?.name);
          return {
            isActive: false,
            name: filterName,
            filter: tag?.slug,
          };
        });
        setCategories([
          { filter: ALL_CATEGORIES, name: ALL_CATEGORIES, isActive: true },
          ...customFilters,
        ]);
      })
      .catch(() => setIsPageError(true));
  }, []);

  // рендеринг
  // заглушка, если нет даты или ошибка
  function returnAnimatedContainer() {
    return (
      <AnimatedPageContainer
        titleText={
          isPageError
            ? ERROR_MESSAGES.generalErrorMessage.title
            : textStubNoData
        }
      />
    );
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
              minLength={validationSettings.question.minLength}
              maxLength={validationSettings.question.maxLength}
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

  const renderchosenQuestion = () => {
    if (state?.fromMainPage && chosenQuestion) {
      return (
        <li className="questions__list-item fade-in" key={chosenQuestion.id}>
          <CardQuestion
            data={chosenQuestion}
            sectionClass="card__questions_type_questions-page"
            isQuestionsPage
            isOpenByDefault
          />
        </li>
      );
    }

    return null;
  };

  function renderQuestionsContainer() {
    return (
      <>
        <ul className="questions">
          {renderchosenQuestion()}
          {questionsPageData.map((question) => (
            <li className="questions__list-item fade-in" key={question?.id}>
              <CardQuestion
                data={question}
                sectionClass="card__questions_type_questions-page"
                isQuestionsPage
              />
            </li>
          ))}
        </ul>
      </>
    );
  }

  // главная функция рендеринга
  const renderPageContent = () => {
    if (questionsPageData?.length > 0) {
      return (
        <>
          <TitleH1 title={title} sectionClass="questions__title" />

          {categories?.length > 1 && (
            <TagsList
              filterList={categories}
              name="tag"
              handleClick={changeCategory}
            />
          )}

          {isLoading ? <Loader isNested /> : renderQuestionsContainer()}

          {currentUser && renderQuestionForm()}
        </>
      );
    }

    // залогинен и нет вопросов, покажем заглушку
    const isDataForPage = questionsPageData?.length > 1;
    if (isPageError || !isDataForPage) {
      return returnAnimatedContainer();
    }

    return null;
  };

  // глобальный лоадер
  if ((!questionsPageData || !categories) && !isPageError) {
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
