import './Footer.scss';
import {
  AFISHA_URL,
  ABOUT_US_URL,
  QUESTIONS_URL,
  PLACES_URL,
  RIGHTS_URL,
  READ_AND_WATCH_URL,
  STORIES_URL,
  AFISHA_TITLE,
  ABOUT_US_TITLE,
  PLACES_TITLE,
  QUESTIONS_TITLE,
  READ_AND_WATCH_TITLE,
  RIGHTS_TITLE,
  STORIES_TITLE,
} from '../../config/routes';
import texts from './locales/RU';
import { socialLinks } from '../../utils/external-links';
import footerLogoPath from '../../assets/footer-logo.svg';
import { NavItem } from '../utils/index';

function Footer() {
  return (
    <footer className="footer">
      <a
        href={texts.logoLink}
        className="footer__logo"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          className="footer__logo-image"
          src={footerLogoPath}
          alt={texts.logoAlt}
        />
      </a>
      <a
        className="button footer__button"
        href={texts.helpButtonLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        {texts.helpButtonText}
      </a>
      <div className="footer__column footer__column_content_concept">
        <p className="footer__brand">{texts.copyright}</p>
        <div className="footer__copyright">
          <p className="footer__authors">
            {texts.devText}
            <a
              href={texts.devLink}
              className="footer__production"
              target="_blank"
              rel="noreferrer"
            >
              {texts.devOrg}
            </a>
          </p>
          <p className="footer__design">
            {texts.designText}
            <a
              href={texts.designLink}
              className="footer__production"
              target="_blank"
              rel="noreferrer"
            >
              {texts.designOrg}
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
            href={ABOUT_US_URL}
            linkText={ABOUT_US_TITLE}
          />
          {/* каленарь */}
          <NavItem
            sectionWrapperClass="footer__column-links"
            sectionLinkClass="footer__column-link"
            href={AFISHA_URL}
            linkText={AFISHA_TITLE}
          />
          {/* куда пойти */}
          <NavItem
            sectionWrapperClass="footer__column-links"
            sectionLinkClass="footer__column-link"
            href={PLACES_URL}
            linkText={PLACES_TITLE}
          />
          {/* вопросы */}
          <NavItem
            sectionWrapperClass="footer__column-links"
            sectionLinkClass="footer__column-link"
            href={QUESTIONS_URL}
            linkText={QUESTIONS_TITLE}
          />
          {/* читать и смотреть */}
          <NavItem
            sectionWrapperClass="footer__column-links"
            sectionLinkClass="footer__column-link"
            href={READ_AND_WATCH_URL}
            linkText={READ_AND_WATCH_TITLE}
          />
          {/* права детей */}
          <NavItem
            sectionWrapperClass="footer__column-links"
            sectionLinkClass="footer__column-link"
            href={RIGHTS_URL}
            linkText={RIGHTS_TITLE}
          />
          {/* истории */}
          <NavItem
            sectionWrapperClass="footer__column-links"
            sectionLinkClass="footer__column-link"
            href={STORIES_URL}
            linkText={STORIES_TITLE}
          />
        </ul>
      </div>
      <div className="footer__column footer__column_content_social">
        <ul className="footer__column-list">
          {socialLinks.map((link) => (
            <li key={link?.id} className="footer__column-links">
              <a
                className="footer__column-link"
                href={link?.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                {link?.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
