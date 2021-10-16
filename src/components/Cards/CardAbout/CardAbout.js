import PropTypes from 'prop-types';
import { Heading, Paragraph } from '../../utils';
import './CardAbout.scss';

function CardAbout({ title, text, color, linkText, href }) {
  return (
    <article className="card-container card-about">
      <div className={`card-about__heading card-about__heading_color_${color}`}>
        <Heading level={2} type="small" content={title} />
      </div>
      <div className="card-about__container">
        <Paragraph sectionClass="card-about__paragraph" content={text} />
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
