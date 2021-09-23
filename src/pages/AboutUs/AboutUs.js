import React from 'react';
import aboutUsTexts from './locales/RU';
import {
  BasePage,
  Blockquote,
  Card,
  CardAbout,
  CardFigure,
  LogoBlue,
  TitleH3,
} from './index';
import './AboutUs.scss';

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

function AboutUs() {
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

        <div className="about__us">
          <CardFigure title={aboutTitle} color="yellow" shape="circle" />

          <Card sectionClass="about__annotation" color="white">
            {React.Children.toArray(
              aboutParagraphs.map((item) => (
                <p className="paragraph about__paragraph">{item?.text}</p>
              ))
            )}
          </Card>
        </div>

        <Blockquote
          sectionWrapperClass="about__quote"
          sectionTitleClass="about__quote-text"
          text={blockquote}
        />

        <div className="about__cards">
          {React.Children.toArray(cards.map((item) => <CardAbout {...item} />))}
        </div>
      </section>
    </BasePage>
  );
}

export default AboutUs;
