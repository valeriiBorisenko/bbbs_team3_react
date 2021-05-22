import { Link } from 'react-router-dom';
import './Footer.scss';
import footerLogoPath from '../../assets/footer-logo.svg';
// import Button from '../ui/Button/Button';
import NavItem from '../ui/NavItem/NavItem';

function Footer() {
  return (
    <footer className="footer">
      <Link to="/" className="footer__logo" target="_self">
        <img className="footer__logo-image" src={footerLogoPath} alt="Логотип Старшие Братья Старшие Сестры России" />
      </Link>
      {/* <Button className="footer__button"
      title="Помочь деньгами" color="white" isDisabled={false} /> */}
      <a className="button footer__button" href="https://www.nastavniki.org/campaign/pomoch-dengami/">Помочь деньгами</a>
      <div className="footer__column footer__column_content_concept">
        <p className="footer__brand">&copy; Старшие Братья Старшие Сестры</p>
        <div className="footer__copyright">
          <p className="footer__authors">
            Разработка – студенты
            {' '}
            <a href="https://praktikum.yandex.ru/" className="footer__production" target="_blank" rel="noreferrer">Яндекс.Практикум</a>
          </p>
          <p className="footer__design">
            Концепция и дизайн –
            {' '}
            <a href="https://krkr.design/" className="footer__production" target="_blank" rel="noreferrer">krkr.design</a>
          </p>
        </div>
      </div>
      <div className="footer__column footer__column_content_info">
        <ul className="footer__column-list">
          {/* о проекте */}
          <NavItem wrapperClasses="footer__column-links" linkClasses="footer__column-link" href="about-us" text="о проекте" />
          {/* каленарь */}
          <NavItem wrapperClasses="footer__column-links" linkClasses="footer__column-link" href="/" text="календарь" />
          {/* куда пойти */}
          <NavItem wrapperClasses="footer__column-links" linkClasses="footer__column-link" href="/" text="куда пойти" />
          {/* вопросы */}
          <NavItem wrapperClasses="footer__column-links" linkClasses="footer__column-link" href="/" text="вопросы" />
          {/* читать и смотреть */}
          <NavItem wrapperClasses="footer__column-links" linkClasses="footer__column-link" href="/" text="читать и смотреть" />
          {/* права детей */}
          <NavItem wrapperClasses="footer__column-links" linkClasses="footer__column-link" href="/" text="права детей" />
          {/* истории */}
          <NavItem wrapperClasses="footer__column-links" linkClasses="footer__column-link" href="/" text="истории" />
        </ul>
      </div>
      <div className="footer__column footer__column_content_social">
        <ul className="footer__column-list">
          {/* fb */}
          <NavItem wrapperClasses="footer__column-links" linkClasses="footer__column-link" href={{ path: 'https://www.facebook.com/BigBrothers.BigSisters.Russia/' }} text="facebook" rel="noreferrer" />
          {/* vk */}
          <NavItem wrapperClasses="footer__column-links" linkClasses="footer__column-link" href={{ path: 'https://vk.com/big.brothers.big.sisters' }} text="vkontakte" rel="noreferrer" />
          {/* insta */}
          <NavItem wrapperClasses="footer__column-links" linkClasses="footer__column-link" href={{ path: 'https://www.instagram.com/nastavniki_org/' }} text="instagram" rel="noreferrer" />
          {/* youtube */}
          <NavItem wrapperClasses="footer__column-links" linkClasses="footer__column-link" href={{ path: 'https://www.youtube.com/user/Nastavniki/' }} text="youtube" rel="noreferrer" />
          {/* youtube */}
          <NavItem wrapperClasses="footer__column-links" linkClasses="footer__column-link" href="/account" text="ЛК (для теста)" />
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
