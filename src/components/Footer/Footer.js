import { Link } from 'react-router-dom';
import './Footer.scss';
import footerLogoPath from '../../assets/footer-logo.svg';
// import Button from '../ui/Button/Button';
import NavItem from '../ui/NavItem/NavItem';

function Footer() {
  return (
    <footer className="footer">
      <Link
        to="/"
        className="footer__logo"
        target="_self"
      >
        <img
          className="footer__logo-image"
          src={footerLogoPath}
          alt="Логотип Старшие Братья Старшие Сестры России"
        />
      </Link>
      <a
        className="button footer__button"
        href="https://www.nastavniki.org/campaign/pomoch-dengami/"
      >
        Помочь деньгами
      </a>
      <div className="footer__column footer__column_content_concept">
        <p className="footer__brand">&copy; Старшие Братья Старшие Сестры</p>
        <div className="footer__copyright">
          <p className="footer__authors">
            Разработка – студенты
            {' '}
            <a
              href="https://praktikum.yandex.ru/"
              className="footer__production"
              target="_blank"
              rel="noreferrer"
            >
              Яндекс.Практикум
            </a>
          </p>
          <p className="footer__design">
            Концепция и дизайн –
            {' '}
            <a
              href="https://krkr.design/"
              className="footer__production"
              target="_blank"
              rel="noreferrer"
            >
              krkr.design
            </a>
          </p>
        </div>
      </div>
      <div className="footer__column footer__column_content_info">
        <ul className="footer__column-list">
          {/* о проекте */}
          <NavItem
            sectionWrapperClass="footer__column-links"
            sectionLinkClass="footer__column-link"
            href="about-us"
            linkText="о проекте"
          />
          {/* каленарь */}
          <NavItem
            sectionWrapperClass="footer__column-links"
            sectionLinkClass="footer__column-link"
            href="/afisha"
            linkText="календарь"
          />
          {/* куда пойти */}
          <NavItem
            sectionWrapperClass="footer__column-links"
            sectionLinkClass="footer__column-link"
            href="/"
            linkText="куда пойти"
          />
          {/* вопросы */}
          <NavItem
            sectionWrapperClass="footer__column-links"
            sectionLinkClass="footer__column-link"
            href="/"
            linkText="вопросы"
          />
          {/* читать и смотреть */}
          <NavItem
            sectionWrapperClass="footer__column-links"
            sectionLinkClass="footer__column-link"
            href="/"
            linkText="читать и смотреть"
          />
          {/* права детей */}
          <NavItem
            sectionWrapperClass="footer__column-links"
            sectionLinkClass="footer__column-link"
            href="/"
            linkText="права детей"
          />
          {/* истории */}
          <NavItem
            sectionWrapperClass="footer__column-links"
            sectionLinkClass="footer__column-link"
            href="/"
            linkText="истории"
          />
        </ul>
      </div>
      <div className="footer__column footer__column_content_social">
        <ul className="footer__column-list">
          {/* fb */}
          <NavItem
            sectionWrapperClass="footer__column-links"
            sectionLinkClass="footer__column-link"
            href={{
              path: 'https://www.facebook.com/BigBrothers.BigSisters.Russia/'
            }}
            linkText="facebook"
            rel="noreferrer"
          />
          {/* vk */}
          <NavItem
            sectionWrapperClass="footer__column-links"
            sectionLinkClass="footer__column-link"
            href={{ path: 'https://vk.com/big.brothers.big.sisters' }}
            linkText="vkontakte"
            rel="noreferrer"
          />
          {/* insta */}
          <NavItem
            sectionWrapperClass="footer__column-links"
            sectionLinkClass="footer__column-link"
            href={{ path: 'https://www.instagram.com/nastavniki_org/' }}
            linkText="instagram"
            rel="noreferrer"
          />
          {/* youtube */}
          <NavItem
            sectionWrapperClass="footer__column-links"
            sectionLinkClass="footer__column-link"
            href={{ path: 'https://www.youtube.com/user/Nastavniki/' }}
            linkText="youtube"
            rel="noreferrer"
          />
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
