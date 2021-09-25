import './Paginate.scss';
import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';
import { useScrollToTop } from '../../../hooks';

const Paginate = (props) => {
  const { pageCount, sectionClass, value, onChange, dontUseScrollUp } = props;

  if (!dontUseScrollUp) {
    useScrollToTop(value);
  }

  return (
    <ReactPaginate
      containerClassName={`pagination ${sectionClass}`}
      pageClassName="pagination__element"
      pageLinkClassName="pagination__element-link"
      activeLinkClassName="pagination__element-link_type_active"
      previousClassName="pagination__element pagination__arrow-element pagination__arrow-element_type_previous"
      breakClassName="pagination__element"
      nextClassName="pagination__element pagination__arrow-element pagination__arrow-element_type_next"
      disabledClassName="pagination__arrow-element_type_disabled"
      pageCount={pageCount}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      forcePage={value}
      onPageChange={({ selected }) => onChange(selected)}
      initialPage={0}
    />
  );
};

Paginate.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  pageCount: PropTypes.number.isRequired,
  sectionClass: PropTypes.string,
  dontUseScrollUp: PropTypes.bool,
};

Paginate.defaultProps = {
  onChange: () => {},
  sectionClass: '',
  dontUseScrollUp: false,
};

export default Paginate;
