import PropTypes from 'prop-types';
import { refineClassNames } from '../../utils/utils';
import { PseudoButtonTag } from '../utils';
import './TagsList.scss';

const centeringFiltersMaxLength = 3;

function TagsList({ filterList, name, handleClick, sectionClass }) {
  const classNames = {
    main: refineClassNames(['tags', sectionClass]),
    list: refineClassNames([
      'tags__list',
      filterList.length > centeringFiltersMaxLength ? 'tags__list_mobile' : '',
    ]),
  };

  return (
    <div className={classNames.main}>
      <ul className={classNames.list}>
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
  handleClick: undefined,
};

export default TagsList;
