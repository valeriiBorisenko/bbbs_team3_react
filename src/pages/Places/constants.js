import placesPageTexts from '../../locales/places-page-RU';

const { ageFilterNames } = placesPageTexts;

const ageFilters = [
  {
    filter: ageFilterNames[0].filter,
    name: ageFilterNames[0].name,
    isActive: false,
  },
  {
    filter: ageFilterNames[1].filter,
    name: ageFilterNames[1].name,
    isActive: false,
  },
  {
    filter: ageFilterNames[2].filter,
    name: ageFilterNames[2].name,
    isActive: false,
  },
  {
    filter: ageFilterNames[3].filter,
    name: ageFilterNames[3].name,
    isActive: false,
  },
];

export default ageFilters;
