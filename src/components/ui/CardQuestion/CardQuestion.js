import './CardQuestion.scss';
import PropTypes from 'prop-types';
import Rubric from '../Rubric/Rubric';
import TitleH2 from '../TitleH2/TitleH2';
import Card from '../Card/Card';

function CardQuestion({ title, tags }) {
  return (
    <Card sectionClass="card-question">
      <TitleH2 sectionClass="card-question__title" title={title} />
      {tags.map((tag) => (
        <Rubric key={tag.id} title={tag.name} sectionClass="card-question__rubric" />
      ))}
    </Card>
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