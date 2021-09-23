import './LogoBlue.scss';
import logoPath from '../../../assets/logo.svg';
import texts from './locales/RU';

function LogoBlue() {
  return <img src={logoPath} alt={texts.altText} className="logo" />;
}

export default LogoBlue;
