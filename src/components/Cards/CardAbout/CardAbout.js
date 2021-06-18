import './CardAbout.scss';
import PropTypes from 'prop-types';
import TitleH2 from '../../utils/TitleH2/TitleH2';

function CardAbout({ title, text, color, linkText, href }) {
  return (
    <article className="card-container card-about">
      <div className={`card-about__heading card-about__heading_color_${color}`}>
        <TitleH2 title={title} />
      </div>
      <div className="card-about__container">
        <p className="paragraph card-about__paragraph">{text}</p>
        <a
          className="link card-about__card-link"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkText}
        </a>
      </div>
    </article>
  );
}

CardAbout.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
  text: PropTypes.string,
  linkText: PropTypes.string,
  href: PropTypes.string,
};

CardAbout.defaultProps = {
  title: '',
  color: '',
  text: '',
  linkText: '',
  href: '#',
};

export default CardAbout;
