import placesPageTexts from '../pages/Places/locales/RU';

const { ageFilterNames } = placesPageTexts;

const ageFiltersArray = ageFilterNames.map((ageFilter) => ({
  filter: ageFilter.filter,
  name: ageFilter.name,
  isActive: false,
}));

export default ageFiltersArray;
