/* eslint-disable no-param-reassign */
import PseudoButtonTag from '../components/utils/PseudoButtonTag/PseudoButtonTag';

export const renderFilterTags = (filterList, type, handleClick) => filterList.map((item) => (
  <li className="tags__list-item" key={item.name}>
    <PseudoButtonTag
      type={type}
      name="categories"
      value={item.filter}
      // filter={item.filter}
      title={item.name}
      isActive={item.isActive}
      onClick={handleClick}
    />
  </li>
));

export const changeCheckboxTagState = (setState, { inputName, isChecked }) => {
  setState((stateFilters) => stateFilters.map((filter) => {
    if (filter.filter === inputName) {
      filter.isActive = isChecked;
    }
    return filter;
  }));
};

export const changeRadioTagState = (setState, { inputName, isChecked }) => {
  console.log('changeRadioTagState');
  console.log('inputName', inputName);
  console.log('isChecked', isChecked);
  setState((stateFilters) => stateFilters.map((filter) => {
    if (filter.filter === inputName) {
      filter.isActive = isChecked;
    } else {
      filter.isActive = false;
    }
    return filter;
  }));
};

export const selectOneTag = (setState, tagName) => {
  setState((stateFilters) => stateFilters.map((filter) => {
    if (filter.filter === tagName) {
      filter.isActive = true;
    } else {
      filter.isActive = false;
    }
    return filter;
  }));
};

export const deselectOneTag = (setState, tagName) => {
  setState((stateFilters) => stateFilters.map((filter) => {
    if (filter.filter === tagName) {
      filter.isActive = false;
    }
    return filter;
  }));
};
