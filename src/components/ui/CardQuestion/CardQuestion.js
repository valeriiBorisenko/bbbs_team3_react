import './CardQuestion.scss';
import PropTypes from 'prop-types';
import Rubric from '../Rubric/Rubric';

function CardQuestion({ title, tags }) {
  return (
    <article className="card-question">
      <h2 className="section-title card-question__title">{title}</h2>
      {tags.map((tag) => (
        <Rubric key={tag.id} title={tag.name} />
      ))}
    </article>
  );
}

CardQuestion.propTypes = {
  title: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.object)
};

CardQuestion.defaultProps = {
  title: '',
  tags: []
};

export default CardQuestion;
