/* eslint-disable no-unused-vars */
import './WhereToGoRecommend.scss';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { FormRecommendation, PopupRecommendSuccess } from './index';

function WhereToGoRecommend({ sectionClass }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const closeSuccessPopup = () => {
    setIsSuccessPopupOpen(false);
    toggleForm();
  };

  const handleFormSubmit = (data) => {
    console.log({ data });
    setIsSuccessPopupOpen(true);
  };

  const classNames = [
    'recommendation',
    'recommendation_place_page',
    'fade-in',
    sectionClass].join(' ').trim();

  return (
    <>
      <section className={classNames}>
        <div className="recommendation__container">
          {isFormOpen && (
          <button
            className="recommendation__close-button"
            type="button"
            aria-label="закрыть попап"
            onClick={toggleForm}
          />
          )}
          <p className="section-title recommendation__text">
            Если вы были в интересном месте и хотите порекомендовать его другим&nbsp;наставникам
            –&nbsp;
            <button
              className="recommendation__text-link"
              type="button"
              onClick={() => setIsFormOpen(true)}
            >
              заполните&nbsp;форму
            </button>
            , и мы добавим вашу&nbsp;рекомендацию.
          </p>
          {/* вызов формы */}
          <FormRecommendation isOpen={isFormOpen} onSubmit={handleFormSubmit} />
        </div>

      </section>
      <PopupRecommendSuccess
        isOpen={isSuccessPopupOpen}
        onClose={closeSuccessPopup}
      />
    </>
  );
}

WhereToGoRecommend.propTypes = {
  sectionClass: PropTypes.string
};

WhereToGoRecommend.defaultProps = {
  sectionClass: ''
};

export default WhereToGoRecommend;
