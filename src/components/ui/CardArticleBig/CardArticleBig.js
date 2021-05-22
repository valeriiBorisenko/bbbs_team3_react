import React from 'react';
import './CardArticleBig.scss';
import PropTypes from 'prop-types';

function CardArticleBig({ color, title }) {
  return (
    <article className="card-article" style={{ backgroundColor: color }}>
      <h3 className="chapter-title card-article__title">{title}</h3>
      <span className="link card-article__link">читать статью</span>
    </article>
  );
}

CardArticleBig.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string
};

CardArticleBig.defaultProps = {
  color: '#fff',
  title: ''
};

export default CardArticleBig;
