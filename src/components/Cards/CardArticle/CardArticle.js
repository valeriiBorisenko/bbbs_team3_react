import PropTypes from 'prop-types';
import texts from './locales/RU';
import { staticImageUrl } from '../../../config/config';
import { refineClassNames } from '../../../utils/utils';
import CardAnnotation from '../CardAnnotation/CardAnnotation';
import {
  Caption,
  Card,
  Heading,
  LinkableComponent,
  StyledLink,
} from '../../utils';
import './CardArticle.scss';

function CardArticle({
  data: { title, info, annotation, image, articleUrl },
  isMain,
  color,
  sectionClass,
}) {
  const classNames = {
    main: refineClassNames([
      'card-container',
      isMain
        ? 'card-container_type_main-article'
        : 'card-container_type_article fade-in',
      sectionClass,
    ]),
    articleCard: refineClassNames([
      'article-card',
      isMain ? 'article-card_main' : '',
    ]),
  };

  const cardColor = isMain ? 'yellow' : color;

  return (
    <article className={classNames.main}>
      <Card sectionClass={classNames.articleCard} color={cardColor}>
        <div className="article-card__title-wrap">
          <LinkableComponent
            Component={Heading}
            path={articleUrl}
            linkSectionClass="article-card__link-wrap"
            isExternal
            level={2}
            type="small"
            sectionClass="article-card__title"
            content={title}
          />
          <Caption sectionClass="article-card__info" title={info} />
        </div>

        {isMain && (
          <div className="article-card__link-wrap article-card__link-wrap_content_article-img">
            {image && (
              <img
                draggable="false"
                src={`${staticImageUrl}/${image}`}
                alt={title}
                className="article-card__image"
                loading="lazy"
              />
            )}
          </div>
        )}

        <StyledLink
          path={articleUrl}
          text={texts.linkText}
          sectionClass="article-card__link"
          isExternal
        />
      </Card>
      <CardAnnotation description={annotation} isMain={isMain} />
    </article>
  );
}

CardArticle.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  info: PropTypes.string,
  image: PropTypes.string,
  articleUrl: PropTypes.string,
  annotation: PropTypes.string,
  color: PropTypes.string,
  isMain: PropTypes.bool,
  sectionClass: PropTypes.string,
};

CardArticle.defaultProps = {
  data: {},
  title: '',
  info: '',
  image: '',
  articleUrl: '',
  annotation: '',
  isMain: false,
  color: 'white',
  sectionClass: '',
};

export default CardArticle;
