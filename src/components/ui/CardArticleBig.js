import React from 'react';
import './CardArticleBig.scss';
import PropTypes from 'prop-types';

function CardArticleBig({ color, title }) {
  return (
    <article className="card-article" style={{ backgroundColor: color }}>
      <a href="./articles.html" className="card-article__link-wrap">
        <h3 className="card-article__title">{title}</h3>
      </a>
      <a href="./articles.html" className="link card__link card-article__link">
        читать статью
      </a>
    </article>
  );
}

CardArticleBig.propTypes = {
  color: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default CardArticleBig;
