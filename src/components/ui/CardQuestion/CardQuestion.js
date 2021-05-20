import './CardQuestion.scss';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Rubric from '../Rubric/Rubric';

function CardQuestion({ title, tags }) {
  return (
    <article className="card-question">
      <Link to="/questions" className="card-question__link">
        <h2 className="section-title card-question__title">{title}</h2>
      </Link>
      {tags.map((tag) => (
        <Rubric key={tag.id} title={tag.name} />
      ))}
    </article>
  );
}

CardQuestion.propTypes = {
  title: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default CardQuestion;
