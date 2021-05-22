import './CardAbout.scss';
import PropTypes from 'prop-types';

function CardAbout({
  title, text, color, linkText, href
}) {
  return (
    <article className="card-container card-about">
      <div className={`card-about__heading card-about__heading_color_${color}`}>
        <h2 className="section-title">{title}</h2>
      </div>
      <div className="card-about__container">
        <div className="card-about__content">
          <div className="card-about__annotation">
            <p className="paragraph">{text}</p>
          </div>
        </div>
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
