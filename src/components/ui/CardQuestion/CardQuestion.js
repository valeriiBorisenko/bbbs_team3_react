import './CardQuestion.scss';
import { useState } from 'react';
import PropTypes from 'prop-types';
import Rubric from '../Rubric/Rubric';
import TitleH2 from '../TitleH2/TitleH2';
import Card from '../Card/Card';
import ButtonRound from '../ButtonRound/ButtonRound';

function CardQuestion({
  data: { title, tags, answer },
  sectionClass,
  isQuestionsPage
}) {
  const [isClick, setIsClick] = useState(false);

  function handleClickButton() {
    setIsClick(!isClick);
  }

  const answerRender = (
    <div className={`question__answer ${isClick ? 'question__answer_visible' : ''}`}>
      <p className="paragraph question__paragraph">{answer}</p>
    </div>
  );

  return (
    <Card sectionClass={`card-question ${sectionClass}`}>
      <TitleH2 sectionClass="card-question__title" title={title} />
      <div className="question__wrap">
        <div className="question__tags">
          {tags.map((tag) => (
            <Rubric key={tag.id} title={tag.name} sectionClass="card-question__rubric" />
          ))}
        </div>
        {isQuestionsPage
          ? (
            <ButtonRound
              label="Показать ответ"
              sectionClass="button-round__questions-page"
              color="lightblue"
              onClick={handleClickButton}
              isClick={isClick}
            />
          ) : ''}
      </div>
      {isQuestionsPage ? answerRender : ''}
    </Card>
  );
}

CardQuestion.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.object),
  sectionClass: PropTypes.string,
  isQuestionsPage: PropTypes.bool,
  answer: PropTypes.string
};

CardQuestion.defaultProps = {
  data: {},
  title: '',
  tags: [],
  sectionClass: '',
  isQuestionsPage: false,
  answer: ''
};

export default CardQuestion;
