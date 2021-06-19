/* eslint-disable no-param-reassign */
import PseudoButtonTag from '../components/utils/PseudoButtonTag/PseudoButtonTag';

export const renderFilterTags = (filterList, type, handleClick) => filterList.map((item) => (
  <li className="tags__list-item" key={item.name}>
    <PseudoButtonTag
      type={type}
      name="categories"
      value={item.filter}
      title={item.name}
      isActive={item.isActive}
      onClick={handleClick}
    />
  </li>
));

export const changeCheckboxTagState = (setState, { inputValue, isChecked }) => {
  setState((stateFilters) => stateFilters.map((filterItem) => {
    if (filterItem.filter === inputValue) {
      filterItem.isActive = isChecked;
    }
    return filterItem;
  }));
};

export const changeRadioTagState = (setState, { inputValue, isChecked }) => {
  setState((stateFilters) => stateFilters.map((filterItem) => {
    if (filterItem.filter === inputValue) {
      filterItem.isActive = isChecked;
      // filterItem.isActive = true;
      console.log('filterItem', filterItem);
    } else {
      filterItem.isActive = false;
    }
    return filterItem;
  }));
};

export const selectOneTag = (setState, tagName) => {
  setState((stateFilters) => stateFilters.map((filterItem) => {
    if (filterItem.filter === tagName) {
      filterItem.isActive = true;
    } else {
      filterItem.isActive = false;
    }
    return filterItem;
  }));
};

export const deselectOneTag = (setState, tagName) => {
  setState((stateFilters) => stateFilters.map((filterItem) => {
    if (filterItem.filter === tagName) {
      filterItem.isActive = false;
    }
    return filterItem;
  }));
};
