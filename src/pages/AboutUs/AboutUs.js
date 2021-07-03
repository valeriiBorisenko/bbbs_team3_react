import './AboutUs.scss';
import { useScrollToTop } from '../../hooks/index';
import aboutUsTexts from '../../locales/about-us-page-RU.js';
import {
  BasePage,
  TitleH3,
  Blockquote,
  LogoBlue,
  CardFigure,
  CardAbout,
  Card,
} from './index';

function AboutUs() {
  useScrollToTop();
  const {
    headTitle,
    headDescription,
    title,
    logoLink,
    aboutTitle,
    aboutParagraphs,
    blockquote,
    cards,
  } = aboutUsTexts;

  return (
    <BasePage headTitle={headTitle} headDescription={headDescription}>
      <section className="about page__section fade-in">
        <TitleH3 sectionClass="about__title" title={title} />
        <a
          className="about__logo"
          href={logoLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <LogoBlue />
        </a>

        {/* желтый круг + белая карточка */}
        <div className="about__us">
          <CardFigure title={aboutTitle} color="yellow" shape="circle" />

          <Card sectionClass="about__annotation" color="white">
            {aboutParagraphs?.map((item) => (
              <p key={item?.id} className="paragraph about__paragraph">
                {item?.text}
              </p>
            ))}
          </Card>
        </div>

        {/* цитата */}
        <Blockquote
          sectionWrapperClass="about__quote"
          sectionTitleClass="about__quote-text"
          text={blockquote}
        />

        {/* секция из 3 карточек с плашками */}
        <div className="about__cards">
          {cards?.map((item) => (
            <CardAbout
              key={item.id}
              title={item?.title}
              text={item?.text}
              linkText={item?.linkText}
              href={item?.href}
              color={item?.color}
            />
          ))}
        </div>
      </section>
    </BasePage>
  );
}

export default AboutUs;
