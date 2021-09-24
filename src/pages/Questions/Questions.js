import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import questionsPageTexts from './locales/RU';
import {
  CurrentUserContext,
  ErrorsContext,
  PopupsContext,
} from '../../contexts';
import { useDebounce, useFormWithValidation } from '../../hooks';
import {
  ALL_CATEGORIES,
  DELAY_DEBOUNCE,
  ERROR_CODES,
  ERROR_MESSAGES,
} from '../../config/constants';
import { changeCaseOfFirstLetter } from '../../utils/utils';
import questionForm from '../../utils/question-form';
import {
  deselectOneTag,
  handleCheckboxBehavior,
  selectOneTag,
} from '../../utils/filter-tags';
import getServerErrors from '../../utils/form-errors';
import {
  getQuestion,
  getQuestionsPageData,
  getQuestionsPageTags,
  postQuestion,
} from '../../api/questions-page';
import {
  AnimatedPageContainer,
  BasePage,
  Button,
  CardQuestion,
  Input,
  Loader,
  Paginate,
  TagsList,
  TitleH1,
  TitleH2,
} from './index';
import './Questions.scss';

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
    maxLength: 500,
  },
};

const pageSize = 10;

const formTransformDelay = 4000;

function Questions() {
  const { currentUser } = useContext(CurrentUserContext);
  const { serverError, setError, clearError } = useContext(ErrorsContext);
  const { openPopupError } = useContext(PopupsContext);

  const { unauthorized, badRequest } = ERROR_CODES;
  const [isPageError, setIsPageError] = useState(false);

  const errorsString = serverError ? getServerErrors(serverError) : '';

  // определение редиректа с Главной, чтобы показать выбранный вопрос
  // + обработка редиректа поиска
  const [mainQuestion, setMainQuestion] = useState(null);
  const { state } = useLocation();
  const chosenQuestion = state?.question;
  const searchQuestionId = state?.id;

  // начальная дата с API
  const [questionsPageData, setQuestionsPageData] = useState(null);

  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isLoadingPaginate, setIsLoadingPaginate] = useState(false);
  // флаг применения фильтров
  const [isFiltersUsed, setIsFiltersUsed] = useState(false);
  // показывать ли выбранный на главной вопрос
  const [isChosenQuestionVisible, setIsChosenQuestionVisible] = useState(false);
  // категории фильтрации, состояние кнопок фильтров
  const [categories, setCategories] = useState(null);

  // Стейты для пагинации
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);

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
      }, formTransformDelay);
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
      deselectOneTag(setCategories, ALL_CATEGORIES);
    }
    setIsFiltersUsed(true);
  };

  // фильтрация
  const getActiveCategories = () => {
    if (categories) {
      return categories
        .filter((filter) => filter.isActive && filter.filter !== ALL_CATEGORIES)
        .map((filter) => filter.filter)
        .join(',');
    }
    return null;
  };

  // Функция обработки запроса АПИ с карточками
  const getQuestionsData = (activeCategories) => {
    const offset = isFiltersUsed ? 0 : pageSize * pageIndex;
    const activeTags = activeCategories || getActiveCategories();

    getQuestionsPageData({
      limit: pageSize,
      offset,
      tags: activeTags,
    })
      .then(({ results, count }) => {
        setPageCount(Math.ceil(count / pageSize));
        setQuestionsPageData(results);
        setIsChosenQuestionVisible(false);
      })
      .catch(() => {
        if (isFiltersUsed) {
          setError(ERROR_MESSAGES.filterErrorMessage);
          openPopupError();
        } else {
          setIsPageError(true);
        }
      })
      .finally(() => {
        setIsLoadingPaginate(false);
        setIsFiltersUsed(false);
      });
  };

  const handleFiltration = () => {
    if (categories && isFiltersUsed) {
      const activeCategories = getActiveCategories();

      if (activeCategories.length === 0) {
        selectOneTag(setCategories, ALL_CATEGORIES);
      }
      getQuestionsData(activeCategories);
    }
  };

  // фильтры/пагинация
  const debounceFiltration = useDebounce(handleFiltration, DELAY_DEBOUNCE);
  const debouncePaginate = useDebounce(getQuestionsData, DELAY_DEBOUNCE);

  // фильтрация
  useEffect(() => {
    if (isFiltersUsed) {
      debounceFiltration();
    }
  }, [isFiltersUsed]);

  // пагинация
  useEffect(() => {
    if (!isLoadingPage && !isFiltersUsed) {
      setIsLoadingPaginate(true);
      debouncePaginate();
    }
  }, [pageSize, pageIndex]);

  // API, первая загрузка
  useEffect(() => {
    Promise.all([
      getQuestionsPageData({ limit: pageSize }),
      getQuestionsPageTags(),
    ])
      .then(([{ results, count }, tags]) => {
        setPageCount(Math.ceil(count / pageSize));

        if (searchQuestionId) {
          getQuestion(searchQuestionId)
            .then((res) => {
              setIsChosenQuestionVisible(true);
              const filteredResult = results.filter(
                (question) => question.id !== res.id
              );
              setMainQuestion(res);
              setQuestionsPageData(filteredResult);
            })
            .catch(() => setIsPageError(true));
        }

        if (chosenQuestion) {
          setIsChosenQuestionVisible(true);
          const filteredResult = results.filter(
            (question) => question.id !== chosenQuestion.id
          );
          setMainQuestion(chosenQuestion);
          setQuestionsPageData(filteredResult);
        } else setQuestionsPageData(results);

        const categoriesArr = tags.map((tag) => {
          const filterName = changeCaseOfFirstLetter(tag?.name);
          return {
            isActive: false,
            name: filterName,
            filter: tag?.slug,
          };
        });

        setCategories([
          { filter: ALL_CATEGORIES, name: ALL_CATEGORIES, isActive: true },
          ...categoriesArr,
        ]);
      })
      .catch(() => setIsPageError(true))
      .finally(() => setIsLoadingPage(false));
  }, [searchQuestionId]);

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

  // рендеринг
  // заглушка, если нет даты или ошибка
  function renderAnimatedContainer() {
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
  function renderQuestionForm() {
    return (
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
  }

  function renderChosenQuestion() {
    if (isChosenQuestionVisible && mainQuestion) {
      return (
        <li className="questions__list-item fade-in">
          <CardQuestion
            data={mainQuestion}
            sectionClass="card__questions_type_questions-page"
            isQuestionsPage
            isOpenByDefault
          />
        </li>
      );
    }

    return null;
  }

  function renderQuestionsContainer() {
    return (
      <>
        <ul className="questions">
          {renderChosenQuestion()}
          {questionsPageData.map((question) => (
            <li
              className="questions__list-item slide-bottom-up"
              key={question?.id}
            >
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

  function renderQuestionsWithPaginate() {
    if (isFiltersUsed) {
      return <Loader isPaginate />;
    }
    return (
      <>
        {isLoadingPaginate ? <Loader isPaginate /> : renderQuestionsContainer()}

        {pageCount > 1 && (
          <Paginate
            sectionClass="cards-section__pagination"
            pageCount={pageCount}
            value={pageIndex}
            onChange={setPageIndex}
          />
        )}
      </>
    );
  }

  // главная функция рендеринга
  function renderPageContent() {
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

          {renderQuestionsWithPaginate()}

          {currentUser && renderQuestionForm()}
        </>
      );
    }

    // залогинен и нет вопросов, покажем заглушку
    const isDataForPage = questionsPageData?.length > 1;
    if (isPageError || !isDataForPage) {
      return renderAnimatedContainer();
    }

    return null;
  }
}

export default Questions;
