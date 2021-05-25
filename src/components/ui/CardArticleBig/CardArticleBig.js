import React from 'react';
import './CardArticleBig.scss';
import PropTypes from 'prop-types';
import TitleH3 from '../TitleH3/TitleH3';

function CardArticleBig({ data: { color, title } }) {
  return (
    <article className="card-article" style={{ backgroundColor: color }}>
      <TitleH3 sectionClass="card-article__title" title={title} />
      <span className="link card-article__link">читать статью</span>
    </article>
  );
}

CardArticleBig.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  color: PropTypes.string,
  title: PropTypes.string
};

CardArticleBig.defaultProps = {
  data: {},
  color: '#fff',
  title: ''
};

export default CardArticleBig;
