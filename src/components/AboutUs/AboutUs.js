import PropTypes from 'prop-types';
import './AboutUs.scss';
import TitleH3 from '../ui/TitleH3/TitleH3';
import Blockquote from '../ui/Blockquote/Blockquote';
import LogoBlue from '../ui/LogoBlue/LogoBlue';
import CardFigure from '../ui/CardFigure/CardFigure';
import CardAnnotation from '../ui/CardAnnotation/CardAnnotation';
import CardAbout from '../ui/CardAbout/CardAbout';
// import { Link } from 'react-router-dom';

//! В НЕКОТОРЫХ МЕСТАХ НАДО ПРАВИТЬ СТИЛИ

function AboutUs({ isAuthorized }) {
  console.log(isAuthorized); // !выкинуть потом
  return (
    <section className="about page__section">
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
        <article className="about__annotation">
          <CardAnnotation>
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
          </CardAnnotation>
        </article>
      </div>

      {/* цитата */}
      <Blockquote
        wrapperClasses="about__quote"
        h3classes="chapter-title about__quote-text"
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
  );
}

AboutUs.propTypes = {
  isAuthorized: PropTypes.bool
};

AboutUs.defaultProps = {
  isAuthorized: false
};

export default AboutUs;
