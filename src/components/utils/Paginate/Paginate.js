import React from 'react';
import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';
import './Paginate.scss';

const Paginate = ({ pageCount, secetionClass, value, onChange }) => (
  <ReactPaginate
    containerClassName={`pagination ${secetionClass}`}
    pageClassName="pagination__element"
    pageLinkClassName="pagination__element-link"
    activeLinkClassName="pagination__element-link_type_active"
    previousClassName="pagination__element pagination__arrow-element pagination__arrow-element_type_previous"
    breakClassName="pagination__element"
    nextClassName="pagination__element pagination__arrow-element"
    disabledClassName="pagination__arrow-element_type_disabled"
    pageCount={pageCount}
    pageRangeDisplayed={3}
    marginPagesDisplayed={1}
    forcePage={value}
    onPageChange={({ selected }) => onChange(selected)}
  />
);

Paginate.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  pageCount: PropTypes.number.isRequired,
  secetionClass: PropTypes.string,
};

Paginate.defaultProps = {
  onChange: () => {},
  secetionClass: '',
};

export default Paginate;
