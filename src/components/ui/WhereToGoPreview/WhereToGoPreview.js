// import PropTypes from 'prop-types';
// import { useState } from 'react';
import FormRecomendation from '../FormRecomendation/FormRecomendation';
import './WhereToGoPreview.scss';

function WhereToGoPreview() {
  function handleRecommendPlace(event) {
    event.preventDefault();
    // onRecommendPlace();
    // setTimeout(() => setShowInputs(!isPlacePopupOpened), 400);
  }

  return (
    <section className="recommendation recommendation_place_page">
      <div className="recommendation__texts">
        <p className="section-title recommendation__text">
          Если вы были в интересном месте и хотите порекомендовать его другим&nbsp;наставникам
          –&nbsp;
          <a href="/" className="recommendation__text-link" onClick={handleRecommendPlace}>
            заполните&nbsp;форму
          </a>
          , и мы добавим вашу&nbsp;рекомендацию.
        </p>
      </div>
      {/* вызов формы */}
      <FormRecomendation />
    </section>
  );
}

export default WhereToGoPreview;
