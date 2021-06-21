import { Helmet } from 'react-helmet-async';
import {
  BasePage, TitleH1, TitleH2, CardsSection
} from './index';
import './Catalog.scss';

function Catalog() {
  return (
    <BasePage>
      <Helmet>
        <title>Справочник</title>
        <meta name="description" content="Справочник полезных статей" />
      </Helmet>
      <section className="catalog page__section fade-in">
        <TitleH1 sectionClass="catalog__title" title="Справочник" />
        <TitleH2
          sectionClass="catalog__subtitle"
          title="Памятка новичка&nbsp;&mdash; наши материалы, где сможете найти всю базовую информацию,
          рассказанную на вводном тренинге. Если вы захотите освежить свои знания, и&nbsp;напомнить
          себе о&nbsp;чем-то."
        />
        <CardsSection />
      </section>
    </BasePage>
  );
}

export default Catalog;
