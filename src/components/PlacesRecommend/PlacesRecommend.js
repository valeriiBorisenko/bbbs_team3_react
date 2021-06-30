import './PlacesRecommend.scss';
import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { FormRecommendation, PopupRecommendSuccess } from './index';
import { postPlace } from '../../api/places-page';

function PlacesRecommend({ sectionClass }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);

  const scrollAnchorRef = useRef(null);
  const scrollToForm = () => {
    scrollAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const openForm = () => {
    setIsFormOpen(true);
    scrollToForm();
  };

  const closeSuccessPopup = () => {
    setIsSuccessPopupOpen(false);
  };

  const closeSuccessPopupOnEsc = (evt) => {
    if (evt.key === 'Escape') {
      closeSuccessPopup();
    }
  };

  const createFormData = (data) => {
    const formData = new FormData();
    if (data.link) formData.append('link', data.link);
    formData.append('image', data.image);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('address', data.address);
    formData.append('gender', data.gender);
    formData.append('age', data.age);
    formData.append('city', data.city);
    formData.append('activityType', data.activityType);
    return formData;
  };

  const handleFormSubmit = (data) => {
    console.log(data);
    postPlace(createFormData(data))
      .then(() => {
        setIsSuccessPopupOpen(true);
        closeForm();
      })
      .catch(console.log);
  };

  const classNames = [
    'recommendation',
    'recommendation_place_page',
    'fade-in',
    sectionClass,
  ]
    .join(' ')
    .trim();

  useEffect(() => {
    window.addEventListener('keyup', closeSuccessPopupOnEsc);
    return () => window.removeEventListener('keyup', closeSuccessPopupOnEsc);
  }, []);

  return (
    <>
      <section className={classNames} ref={scrollAnchorRef}>
        <div className="recommendation__container">
          {isFormOpen && (
            <button
              className="recommendation__close-button"
              type="button"
              aria-label="закрыть попап"
              onClick={closeForm}
            />
          )}
          <p className="section-title recommendation__text">
            Если вы были в интересном месте и хотите порекомендовать его
            другим&nbsp;наставникам –&nbsp;
            <button
              className="recommendation__text-link"
              type="button"
              onClick={openForm}
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

PlacesRecommend.propTypes = {
  sectionClass: PropTypes.string,
};

PlacesRecommend.defaultProps = {
  sectionClass: '',
};

export default PlacesRecommend;
