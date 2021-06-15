import './AboutUs.scss';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  BasePage, TitleH3, Blockquote, LogoBlue, CardFigure, CardAbout, Card
} from './index';

function AboutUs() {
  useEffect(() => {
    window.scrollTo({
      top: 0
    });
  }, []);

  return (
    <BasePage>
      <Helmet>
        <title>О проекте</title>
        <meta name="description" content="Информация об организации Старшие Братья Старшие Сёстры" />
      </Helmet>
      <section className="about page__section fade-in">
        <TitleH3
          sectionClass="about__title"
          title="Наставники.про – цифровая информационная платформа организации «Старшие Братья Старшие Сестры». Созданная для поддержки наставников программы."
        />
        <a
          className="about__logo"
          href="https://www.nastavniki.org/o-nas/ob-organizaczii/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LogoBlue />
        </a>

        {/* желтый круг + белая карточка */}
        <div className="about__us">
          <CardFigure title="Об организации" color="yellow" shape="circle" />

          <Card sectionClass="about__annotation" color="white">
            <p className="paragraph about__paragraph">
              «Старшие Братья Старшие Сестры» — межрегиональная общественная
              организация содействия воспитанию подрастающего поколения. Мы
              поддерживаем детей, которым требуется внимание: оставшихся без
              попечения родителей, приемных, детей из неполных, многодетных или
              неблагополучных семей, детей с ограниченными возможностями.
            </p>
            <p className="paragraph about__paragraph">
              Любому человеку, тем более ребенку, необходимо общение. Без него
              дети растут неуверенными и замкнутыми. Одиночество токсично, а
              самое надежное противоядие – дружба.
            </p>
            <p className="paragraph about__paragraph">
              Мы помогаем детям, которым не хватает поддержки взрослого друга,
              «Младшим». Таким другом становится наш волонтер, «Старший». Он
              принимает ребенка, какой он есть, поддерживает, помогает раскрыть
              потенциал, почувствовать уверенность в своих силах, узнать
              элементарные вещи о жизни, адаптироваться и полноценно участвовать
              в жизни общества.
            </p>
          </Card>
        </div>

        {/* цитата */}
        <Blockquote
          sectionWrapperClass="about__quote"
          sectionTitleClass="about__quote-text"
          text="Мы хотим, чтобы наставник был у каждого ребенка, который в нем нуждается"
        />

        {/* секция из 3 карточек с плашками */}
        <div className="about__cards">
          <CardAbout
            title="Пожертвования"
            text="Деньги пойдут на оплату работы кураторов (профессиональные психологи/социальные работники), которые поддерживают дружбу между ребенком и наставником."
            linkText="сделать пожертвование"
            href="https://www.nastavniki.org/campaign/pomoch-dengami/"
            color="blue"
          />

          <CardAbout
            title="Наставничество"
            text="Наставник «Старшие Братья Старшие Сестры» — значимый взрослый, который становится для ребенка старшим другом, ролевой моделью, принимает своего «Младшего» таким, какой он есть. «Старший» открывает для ребенка дверь в большой мир и дарит ему надежду на более счастливое и успешное будущее."
            linkText="подробнее"
            href="https://www.nastavniki.org/volontyorstvo/kak-stat-volonterom/"
            color="pink"
          />

          <CardAbout
            title="Партнерство"
            text="Компании поддерживают нас не только деньгами, но и делами. Мы собрали все возможные способы поддержки и сотрудничества: профессиональная помощь Pro Bono, организационная помощь, корпоративное волонтерство, мастер-классы, лекции, учебные программы."
            linkText="подробнее"
            href="https://www.nastavniki.org/oficzialno/nashi-partneryi/"
            color="green"
          />
        </div>
      </section>
    </BasePage>
  );
}

export default AboutUs;
