import React from 'react';
import './CardRights.scss';

import PropTypes from 'prop-types';

import { CardFigure, Rubric } from './index';

function CardRights({ title, tags, shape, color }) {
  return (
    <div className="rights__card">
      <a href="/" className="rights__link">
        <CardFigure
          sectionClass="card-catalog_type_shaped"
          shape={shape}
          title={title}
          color={color}
        >
          {tags.map((tag) => (
            <Rubric
              key={tag.id}
              sectionClass="rights__rubric"
              title={tag.category}
            />
          ))}
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
