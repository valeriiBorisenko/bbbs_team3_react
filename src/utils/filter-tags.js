/* eslint-disable no-param-reassign */
import PseudoButtonTag from '../components/utils/PseudoButtonTag/PseudoButtonTag';
//! удалить рендер, есть компонент TagsList
export const renderFilterTags = (filterList, name, handleClick) =>
  filterList.map((item) => (
    <li className="tags__list-item" key={item.name}>
      <PseudoButtonTag
        name={name}
        value={item.filter}
        title={item.name}
        isActive={item.isActive}
        onClick={handleClick}
      />
    </li>
  ));

export const handleCheckboxBehavior = (setState, { inputValue, isChecked }) => {
  setState((stateFilters) =>
    stateFilters.map((filterItem) => {
      if (filterItem.filter === inputValue) {
        filterItem.isActive = isChecked;
      }
      return filterItem;
    })
  );
};

export const handleRadioBehavior = (setState, { inputValue, isChecked }) => {
  setState((stateFilters) =>
    stateFilters.map((filterItem) => {
      if (filterItem.filter === inputValue) {
        filterItem.isActive = isChecked;
      } else {
        filterItem.isActive = false;
      }
      return filterItem;
    })
  );
};

export const selectOneTag = (setState, tagName) => {
  setState((stateFilters) =>
    stateFilters.map((filterItem) => {
      if (filterItem.filter === tagName) {
        filterItem.isActive = true;
      } else {
        filterItem.isActive = false;
      }
      return filterItem;
    })
  );
};

export const deselectOneTag = (setState, tagName) => {
  setState((stateFilters) =>
    stateFilters.map((filterItem) => {
      if (filterItem.filter === tagName) {
        filterItem.isActive = false;
      }
      return filterItem;
    })
  );
};

export const deselectAllTags = (setState) => {
  setState((stateFilters) =>
    stateFilters.map((filterItem) => {
      filterItem.isActive = false;
      return filterItem;
    })
  );
};
