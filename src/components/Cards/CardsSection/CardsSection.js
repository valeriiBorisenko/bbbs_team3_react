import React, { useEffect, useState } from 'react';
import CardCatalog from '../CardCatalog/CardCatalog';
import './CardsSection.scss';
import Api from '../../../utils/api';
import { FIGURES } from '../../../config/constants';

function CardsSection() {
  const [catalogPageData, setCatalogPageData] = useState([]);
  useEffect(() => {
    Api.getCatalogPageData().then(({ catalog }) => setCatalogPageData(catalog));
  }, []);
  return (
    <section className="cards-section">
      <div className="cards-section__line" />
      <div className="cards-section__line" />
      <div className="cards-section__line" />
      {catalogPageData.map((item, i) => (
        <CardCatalog title={item.title} image={item.imageUrl} shape={FIGURES[i % FIGURES.length]} />
      ))}
    </section>
  );
}

export default CardsSection;
