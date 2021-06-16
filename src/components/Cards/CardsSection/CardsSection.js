import CardCatalog from '../CardCatalog/CardCatalog';
import './CardsSection.scss';

function CardsSection() {
  return (
    <section className="cards-section page__section">
      <div className="cards-section__line" />
      <div className="cards-section__line" />
      <div className="cards-section__line" />
      <CardCatalog />
    </section>
  );
}

export default CardsSection;
