import React from 'react';
import aboutUsTexts from './locales/RU';
import {
  BasePage,
  Blockquote,
  Card,
  CardAbout,
  CardFigure,
  Heading,
  LinkableComponent,
  Logo,
  Paragraph,
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
        <Heading
          sectionClass="about__title"
          content={title}
          level={1}
          type="medium"
        />
        <LinkableComponent
          Component={Logo}
          linkSectionClass="about__logo"
          path={logoLink}
          isExternal
        />

        <div className="about__us">
          <CardFigure title={aboutTitle} color="yellow" shape="circle" />

          <Card sectionClass="about__annotation" color="white">
            {React.Children.toArray(
              aboutParagraphs.map((item) => (
                <Paragraph
                  sectionClass="about__paragraph"
                  content={item.text}
                />
              ))
            )}
          </Card>
        </div>

        <Blockquote sectionClass="about__quote" text={blockquote} />

        <div className="about__cards">
          {React.Children.toArray(cards.map((item) => <CardAbout {...item} />))}
        </div>
      </section>
    </BasePage>
  );
}

export default AboutUs;
