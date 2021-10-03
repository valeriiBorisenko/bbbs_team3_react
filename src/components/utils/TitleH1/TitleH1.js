import './TitleH1.scss';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function TitleH1({ title, sectionClass, isLinkable, href }) {
  if (isLinkable) {
    return (
      <Link to={href} className={`linkable ${sectionClass}`}>
        <h1 className="main-title">{title}</h1>
      </Link>
    );
  }

  return <h1 className={`main-title ${sectionClass}`}>{title}</h1>;
}

TitleH1.propTypes = {
  title: PropTypes.string,
  sectionClass: PropTypes.string,
  isLinkable: PropTypes.bool,
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

TitleH1.defaultProps = {
  title: '',
  sectionClass: '',
  isLinkable: false,
  href: '/',
};

export default TitleH1;
