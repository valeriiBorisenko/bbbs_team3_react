import './TagsList.scss';
import PropTypes from 'prop-types';
import { PseudoButtonTag } from '../utils/index';

const centeringFiltersMaxLength = 3;

function TagsList({ filterList, name, handleClick, sectionClass }) {
  const classNames = ['tags', sectionClass].join(' ').trim();
  const classNamesList = [
    'tags__list',
    filterList.length > centeringFiltersMaxLength ? 'tags__list_mobile' : '',
  ]
    .join(' ')
    .trim();

  return (
    <div className={classNames}>
      <ul className={classNamesList}>
        {filterList.map((item) => (
          <li className="tags__list-item" key={item?.name}>
            <PseudoButtonTag
              name={name}
              value={item?.filter}
              title={item?.name}
              isActive={item?.isActive}
              onClick={handleClick}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

TagsList.propTypes = {
  filterList: PropTypes.arrayOf(PropTypes.any),
  sectionClass: PropTypes.string,
  name: PropTypes.string,
  handleClick: PropTypes.func,
};

TagsList.defaultProps = {
  filterList: [],
  sectionClass: '',
  name: '',
  handleClick: () => {},
};

export default TagsList;
