import { useState } from 'react';
import PropTypes from 'prop-types';
import FormRecomendation from '../FormRecomendation/FormRecomendation';
import './WhereToGoPreview.scss';

function WhereToGoPreview({ sectionClass }) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const scrollToForm = () => {
    const isSmallDesktop = window.innerWidth > 899 && window.innerWidth < 1100;
    let position;

    if (isSmallDesktop) {
      position = 230;
    } else {
      position = 150;
    }

    window.scrollTo({
      top: position,
      behavior: 'smooth'
    });
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
    if (!isFormOpen) scrollToForm();
  };

  const handleFormSubmit = (data) => {
    console.log({ data });
    toggleForm();
  };

  const classNames = [
    'recommendation',
    'recommendation_place_page',
    'fade-in',
    sectionClass].join(' ').trim();

  return (
    <section className={classNames}>
      <div className="recommendation__container">
        <p className="section-title recommendation__text">
          Если вы были в интересном месте и хотите порекомендовать его другим&nbsp;наставникам
          –&nbsp;
          <button
            className="recommendation__text-link"
            type="button"
            onClick={toggleForm}
          >
            заполните&nbsp;форму
          </button>
          , и мы добавим вашу&nbsp;рекомендацию.
        </p>
        {/* вызов формы */}
        <FormRecomendation isOpen={isFormOpen} onSubmit={handleFormSubmit} />
      </div>

    </section>
  );
}

WhereToGoPreview.propTypes = {
  sectionClass: PropTypes.string
};

WhereToGoPreview.defaultProps = {
  sectionClass: ''
};

export default WhereToGoPreview;
