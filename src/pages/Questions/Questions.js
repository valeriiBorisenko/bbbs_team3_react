import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import questionsPageTexts from './locales/RU';
import { CurrentUserContext, ErrorsContext } from '../../contexts';
import { ERROR_CODES, ERROR_MESSAGES } from '../../config/constants';
import { useFiltrationAndPagination, useFormWithValidation } from '../../hooks';
import questionForm from '../../utils/question-form';
import getServerErrors from '../../utils/form-errors';
import {
  getQuestionById,
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
  formSubmitButtonLoading,
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

  const errorsString = serverError ? getServerErrors(serverError) : '';
  const { unauthorized, badRequest } = ERROR_CODES;

  const [isPageError, setIsPageError] = useState(false);
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);

  // определение редиректа с Главной + обработка редиректа поиска
  const [mainQuestion, setMainQuestion] = useState(null);
  const { state } = useLocation();

  const questionFromMainPage = state?.question;
  const searchQuestionId = state?.id;

  // показывать ли выбранный вопрос (на главной или в поиске)
  const [isMainQuestionVisible, setIsMainQuestionVisible] = useState(false);

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
    setIsWaitingResponse(true);
    postQuestion({ title: question })
      .then(() => setFormState(false))
      .catch((err) => {
        if (err?.status === badRequest || err?.status === unauthorized)
          setError(err?.data);
        else setFormState(true);
      })
      .finally(() => setIsWaitingResponse(false));
  };

  // фильтрация и пагинация
  const filtersAndPaginationSettings = {
    apiGetDataCallback: getQuestionsPageData,
    apiGetFiltersCallback: getQuestionsPageTags,
    apiFilterNames: {
      tags: 'tags',
    },
    pageSize,
    setIsPageError,
  };

  const {
    dataToRender,
    filters,
    isPageLoading,
    isFiltersUsed,
    isPaginationUsed,
    totalPages,
    pageIndex,
    changePageIndex,
    changeFilter,
  } = useFiltrationAndPagination(filtersAndPaginationSettings);

  // эффекты рулят показом главного вопроса
  useEffect(() => {
    if (searchQuestionId) {
      getQuestionById(searchQuestionId)
        .then((question) => {
          setIsMainQuestionVisible(true);
          setMainQuestion(question);
        })
        .catch(() => setIsPageError(true));
    }

    if (questionFromMainPage) {
      setIsMainQuestionVisible(true);
      setMainQuestion(questionFromMainPage);
    }
  }, [searchQuestionId, questionFromMainPage]);

  useEffect(() => {
    if (isMainQuestionVisible) {
      setIsMainQuestionVisible(false);
    }
  }, [isPaginationUsed, isFiltersUsed]);

  // фильтр первой выдачи от главного вопроса
  const filterDataFormMainQuestion = (data) => {
    if (questionFromMainPage && isMainQuestionVisible) {
      return data.filter((question) => question.id !== questionFromMainPage.id);
    }
    if (searchQuestionId && isMainQuestionVisible) {
      return data.filter((question) => question.id !== searchQuestionId);
    }
    return data;
  };

  // итоговые данные
  const filteredDataToRender = filterDataFormMainQuestion(dataToRender);

  // глобальный лоадер
  if (isPageLoading) {
    return <Loader isCentered />;
  }

  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      <section className="questions-page page__section fade-in">
        {renderPageContent()}
      </section>
    </BasePage>
  );

  function renderPageContent() {
    if (isPageError || !filteredDataToRender.length) {
      return renderAnimatedContainer();
    }

    return (
      <>
        <TitleH1 title={title} sectionClass="questions__title" />

        {renderFilters()}

        {renderQuestionsWithPaginate()}

        {currentUser && renderQuestionForm()}
      </>
    );
  }

  // заглушка
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

  function renderFilters() {
    // учитываем кнопку ВСЕ
    if (filters.length > 2) {
      return (
        <TagsList filterList={filters} name="tag" handleClick={changeFilter} />
      );
    }
    return null;
  }

  function renderQuestionsWithPaginate() {
    if (isFiltersUsed) {
      return <Loader isPaginate />;
    }

    return (
      <>
        {isPaginationUsed ? <Loader isPaginate /> : renderQuestionsContainer()}

        {totalPages > 1 && (
          <Paginate
            sectionClass="cards-section__pagination"
            pageCount={totalPages}
            value={pageIndex}
            onChange={changePageIndex}
          />
        )}
      </>
    );
  }

  function renderQuestionsContainer() {
    return (
      <>
        <ul className="questions">
          {renderMainQuestion()}
          {filteredDataToRender.map((question) => (
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

  function renderMainQuestion() {
    if (isMainQuestionVisible && mainQuestion) {
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
                title={
                  isWaitingResponse ? formSubmitButtonLoading : formSubmitButton
                }
                color="black"
                sectionClass="question-form__button"
                isSubmittable
                isDisabled={isWaitingResponse || !isValid}
              />
            </fieldset>
            <span className="form-error-message">{errorsString}</span>
          </form>
        </section>
      </>
    );
  }
}

export default Questions;
