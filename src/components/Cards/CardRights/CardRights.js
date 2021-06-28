import React, { useEffect, useState } from 'react';
import './CardRights.scss';

import PropTypes from 'prop-types';

import { CardFigure, Rubric } from './index';

function CardRights({ title, tags, shape, color }) {
  const [uniqueCategories, setUniqueCategories] = useState([]);

  const randNum = () => Math.random().toString(36).substr(2, 9);

  // Убираем одинаковые категории, отрисовываем только уникальные
  useEffect(() => {
    const categoriesArr = tags.map((tag) => tag.category);
    const unique = Array.from(new Set(categoriesArr));
    setUniqueCategories(unique);
  }, [tags]);

  return (
    <div className="rights__card">
      <a href="/" className="rights__link">
        <CardFigure shape={shape} title={title} color={color}>
          <div className="rights__block">
            {uniqueCategories.map((item) => (
              <Rubric
                key={randNum()}
                sectionClass="rights__rubric"
                title={item}
              />
            ))}
          </div>
        </CardFigure>
      </a>
    </div>
  );
}

CardRights.propTypes = {
  title: PropTypes.string,
  shape: PropTypes.string,
  tags: PropTypes.arrayOf(Array),
  color: PropTypes.string,
};

CardRights.defaultProps = {
  title: '',
  shape: 'square',
  tags: [],
  color: '',
};

export default CardRights;
