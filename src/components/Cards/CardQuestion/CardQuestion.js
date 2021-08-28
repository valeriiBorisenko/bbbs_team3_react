import './CardQuestion.scss';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import texts from './locales/RU';
import { QUESTIONS_URL } from '../../../config/routes';
import { Rubric, TitleH2, Card, ButtonRound } from '../../utils/index';

const animationTransition = 300;

function CardQuestion({
  data: { title, tags, answer },
  sectionClass,
  href,
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
        }, animationTransition);
      } else {
        setIsOpened(true);
        setTimeout(() => {
          setIsAnimated(true);
        }, animationTransition);
      }
    }
  }

  const getDynamicStyle = () => {
    if (ref && ref.current && isOpened) {
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

  const renderTitleWrap = (childElement) => {
    if (isQuestionsPage)
      return (
        <div
          className="card-question__title-wrap"
          onClick={handleClickButton}
          onKeyPress={handleClickButton}
          role="button"
          tabIndex="0"
          aria-label={texts.labelText}
        >
          {childElement}
        </div>
      );
    return (
      <Link
        to={href}
        className="card-question__title-wrap"
        onClick={handleClickButton}
      >
        {childElement}
      </Link>
    );
  };

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

        {renderTitleWrap(
          <TitleH2
            sectionClass="card-question__title clickable"
            title={title}
          />
        )}

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
  answer: PropTypes.string,
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  isQuestionsPage: PropTypes.bool,
  isOpenByDefault: PropTypes.bool,
};

CardQuestion.defaultProps = {
  data: {},
  title: '',
  tags: [],
  sectionClass: '',
  answer: '',
  href: QUESTIONS_URL,
  isQuestionsPage: false,
  isOpenByDefault: false,
};

export default CardQuestion;
