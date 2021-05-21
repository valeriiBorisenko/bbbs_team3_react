import { Link } from 'react-router-dom';
import './LogoBlue.scss';
import PropTypes from 'prop-types';
import logoPath from '../../../assets/logo.svg';

function LogoBlue({ sectionClass }) {
  return (
    <Link to="/">
      <img
        src={logoPath}
        alt="Логотип Старшие Братья Старшие Сестры России"
        className={`logo ${sectionClass}`}
      />
    </Link>
  );
}

LogoBlue.propTypes = {
  sectionClass: PropTypes.string
};

LogoBlue.defaultProps = {
  sectionClass: ''
};

export default LogoBlue;
