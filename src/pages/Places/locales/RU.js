import { MAIN_PAGE_TITLE, PLACES_TITLE } from '../../../config/routes';

const placesPageTexts = {
  headTitle: `${MAIN_PAGE_TITLE} | ${PLACES_TITLE}`,
  headDescription: 'Куда вы можете пойти, что рекомендуют наши наставники.',
  title: PLACES_TITLE,
  textStubNoData:
    'Рекомендуемых мест для выбранного города ещё нет, но они обязательно появятся!',
  paragraphNoContent: 'По вашему запросу ничего не нашлось.',
  mentorTag: 'Выбор наставников',
  toMainPageLinkTitle: 'Все места',
  ageFilterNames: [
    { filter: '8-10', name: '8-10 лет' },
    { filter: '11-13', name: '11-13 лет' },
    { filter: '14-17', name: '14-17 лет' },
    { filter: '18', name: '18+ лет' },
  ],
};

export default placesPageTexts;
