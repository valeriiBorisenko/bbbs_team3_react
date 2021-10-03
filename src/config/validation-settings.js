// попап логин
export const popupLoginValidationSettings = {
  username: {
    maxLength: 150,
  },
  password: {
    minLength: 8,
  },
};

// поиск
export const searchValidationSettings = {
  search: {
    maxLength: 200,
  },
};

// форма рекомендации в Куда пойти
export const placesValidationSettings = {
  title: {
    minLength: 1,
    maxLength: 200,
  },
  address: {
    minLength: 1,
    maxLength: 200,
  },
  age: {
    min: 8,
    max: 25,
  },
};

// форма вопроса на странице Вопросы
export const questionFormValidationSettings = {
  question: {
    minLength: 1,
    maxLength: 500,
  },
};

// форма в ЛК
export const diaryFormValidationSettings = {
  place: {
    minLength: 1,
    maxLength: 50,
  },
  description: {
    maxLength: 1024,
  },
};
