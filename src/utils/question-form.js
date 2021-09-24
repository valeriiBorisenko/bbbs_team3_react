const questionForm = {
  beforeSubmit: {
    title:
      'Если вы не нашли ответ на свой вопрос — напишите нам, и мы включим его в список',
    titleClass: '',
    formVisibilityClass: '',
  },
  successSubmit: {
    title:
      'Спасибо! Мы приняли ваш вопрос. Ваш вопрос опубликуют, как только он пройдет проверку и модератор даст на него ответ!',
    titleClass: 'add-question__title_success',
    formVisibilityClass: 'question-form_invisible',
  },
  errorSubmit: {
    title:
      'Произошла ошибка при отправке вашего вопроса! Попробуйте повторить позже или обратиться в службу поддержки!',
    titleClass: 'add-question__title_error',
  },
};

export default questionForm;
