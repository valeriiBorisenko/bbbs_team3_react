import './CardQuestion.scss';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import texts from './locales/RU';
import { Rubric, TitleH2, Card, ButtonRound } from '../../utils/index';

function CardQuestion({
  data: { title, tags, answer },
  sectionClass,
  isQuestionsPage,
  isOpenByDefault,
}) {
  const [isOpened, setIsOpened] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const ref = useRef();

  function handleClickButton() {
    if (isQuestionsPage) {
      if (isOpened) {
        setIsAnimated(false);
        setTimeout(() => {
          setIsOpened(false);
        }, 300);
      } else {
        setIsOpened(true);
        setTimeout(() => {
          setIsAnimated(true);
        }, 300);
      }
    }
  }

  const getDynamicStyle = () => {
    if (isOpened) {
      return {
        minHeight: ref.current.clientHeight,
      };
    }

    if (isOpenByDefault && isAnimated) return { height: 'auto' };

    return { height: 0 };
  };

  const tagsClassNames = [
    'card-question__tags',
    isQuestionsPage ? 'card-question__tags_questions-page' : '',
  ]
    .join(' ')
    .trim();

  const answerWrapperClassNames = [
    'card-question__answer',
    isOpened ? 'card-question__answer_opened' : '',
  ]
    .join(' ')
    .trim();

  useEffect(() => {
    if (ref && ref.current && isOpenByDefault) {
      setIsOpened(true);
      setIsAnimated(true);
    }
  }, [ref.current]);

  return (
    <Card sectionClass={`card-question ${sectionClass}`}>
      <div className="card-question__wrap">
        {isQuestionsPage && (
          <ButtonRound
            label={texts.labelText}
            sectionClass="button-round__questions-page clickable"
            color="lightblue"
            onClick={handleClickButton}
            isClick={isOpened}
          />
        )}

        <div
          className="card-question__title-container"
          onClick={handleClickButton}
          onKeyPress={handleClickButton}
          role="button"
          tabIndex="0"
        >
          <TitleH2
            sectionClass="card-question__title clickable"
            title={title}
          />
        </div>

        <ul className={tagsClassNames}>
          {tags?.map((tag) => (
            <li className="card-question__tag" key={tag?.id}>
              <Rubric title={tag?.name} sectionClass="card-question__rubric" />
            </li>
          ))}
        </ul>
      </div>
      {isQuestionsPage && (
        <div className={answerWrapperClassNames} style={getDynamicStyle()}>
          <p
            ref={ref}
            className={`paragraph card-question__paragraph card-question__answer_text-hidden ${
              isAnimated ? 'card-question__answer_text-active' : ''
            }`}
          >
            {answer}
          </p>
        </div>
      )}
    </Card>
  );
}

CardQuestion.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.object),
  sectionClass: PropTypes.string,
  isQuestionsPage: PropTypes.bool,
  answer: PropTypes.string,
  isOpenByDefault: PropTypes.bool,
};

CardQuestion.defaultProps = {
  data: {},
  title: '',
  tags: [],
  sectionClass: '',
  isQuestionsPage: false,
  answer: '',
  isOpenByDefault: false,
};

export default CardQuestion;
