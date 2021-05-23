import './CardAbout.scss';
import PropTypes from 'prop-types';
import TitleH2 from '../TitleH2/TitleH2';
import CardAnnotationContainer from '../CardAnnotation/CardAnnotationContainer';

function CardAbout({
  title, text, color, linkText, href
}) {
  return (
    <article className="card-container card-about">
      <div className={`card-about__heading card-about__heading_color_${color}`}>
        <TitleH2 title={title} />
      </div>
      <div className="card-about__container">
        <CardAnnotationContainer>
          <p className="paragraph card-about__paragraph">{text}</p>
        </CardAnnotationContainer>
        <a href={href} target="_blank" className="link card-about__card-link" rel="noopener noreferrer">{linkText}</a>
      </div>
    </article>
  );
}

CardAbout.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
  text: PropTypes.string,
  linkText: PropTypes.string,
  href: PropTypes.string
};

CardAbout.defaultProps = {
  title: '',
  color: '',
  text: '',
  linkText: '',
  href: '#'
};

export default CardAbout;
