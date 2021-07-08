import './PlacesRecommend.scss';
import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import texts from './locales/RU';
import { PopupRecommendSuccess } from '../Popups/index';
import FormRecommendation from '../FormRecommendation/FormRecommendation';
import { postPlace } from '../../api/places-page';

function PlacesRecommend({ sectionClass, activityTypes }) {
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
              aria-label={texts.closeButtonlabel}
              onClick={closeForm}
            />
          )}
          <p className="section-title recommendation__text">
            {texts.recommendadionTextPart1}
            <button
              className="recommendation__text-link"
              type="button"
              onClick={openForm}
            >
              {texts.recommendadionButton}
            </button>
            {texts.recommendadionTextPart2}
          </p>
          <FormRecommendation
            isOpen={isFormOpen}
            onSubmit={handleFormSubmit}
            activityTypes={activityTypes}
          />
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
  activityTypes: PropTypes.arrayOf(PropTypes.object),
  sectionClass: PropTypes.string,
};

PlacesRecommend.defaultProps = {
  activityTypes: [],
  sectionClass: '',
};

export default PlacesRecommend;
