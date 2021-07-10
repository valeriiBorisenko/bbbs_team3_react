import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function LinkableHeading({
  Component: TitleComponent,
  title,
  path,
  titleSectionClass,
  linkSectionClass,
}) {
  return (
    <Link className={linkSectionClass} to={path}>
      <TitleComponent title={title} sectionClass={titleSectionClass} />
    </Link>
  );
}

LinkableHeading.propTypes = {
  Component: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  titleSectionClass: PropTypes.string,
  linkSectionClass: PropTypes.string,
};

LinkableHeading.defaultProps = {
  titleSectionClass: '',
  linkSectionClass: '',
};

export default LinkableHeading;
