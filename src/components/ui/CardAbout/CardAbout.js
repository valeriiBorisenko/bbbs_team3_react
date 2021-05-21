import './CardAbout.scss';
import PropTypes from 'prop-types';

function CardAbout({
  title, text, color, linkText, href
}) {
  return (
    <article className="card-container about__card-container">
      <div className={`card card_color_${color} about__card`}>
        <h2 className="section-title">{title}</h2>
      </div>
      <div className="card card_content_annotation">
        <div className="card__content about__card-content">
          <div className="card__annotation">
            <p className="paragraph card__paragraph">{text}</p>
          </div>
        </div>
        <a href={href} target="_blank" className="link card__link about__card-link" rel="noreferrer">{linkText}</a>
      </div>
    </article>
  );
}

CardAbout.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired
};

export default CardAbout;
