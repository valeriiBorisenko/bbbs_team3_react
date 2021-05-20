import React from 'react';
import './CardArticleBig.scss';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function CardArticleBig({ color, title }) {
  return (
    <article className="card-article" style={{ backgroundColor: color }}>
      <Link to="/articles" className="card-article__link-wrap">
        <h3 className="chapter-title card-article__title">{title}</h3>
      </Link>
      <Link to="/articles" className="link card-article__link">
        читать статью
      </Link>
    </article>
  );
}

CardArticleBig.propTypes = {
  color: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default CardArticleBig;
