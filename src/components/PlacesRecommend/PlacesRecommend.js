import './PlacesRecommend.scss';
import { useState, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import texts from './locales/RU';
import { PopupsContext, ErrorsContext } from '../../contexts/index';
import { ERROR_CODES, ERROR_MESSAGES } from '../../config/constants';
import FormRecommendation from '../FormRecommendation/FormRecommendation';
import { postPlace } from '../../api/places-page';

function PlacesRecommend({ sectionClass, activityTypes }) {
  const { openPopupRecommendSuccess } = useContext(PopupsContext);
  const { setError } = useContext(ErrorsContext);
  const { generalErrorMessage } = ERROR_MESSAGES;
  const { unauthorized, badRequest } = ERROR_CODES;

  const [isFormOpen, setIsFormOpen] = useState(false);

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
        openPopupRecommendSuccess(true);
      })
      .catch((err) => {
        if (err?.status === badRequest || err?.status === unauthorized) {
          setError(err?.data);
          closeForm();
        } else
          setError({
            message: generalErrorMessage,
          });
      });
  };

  const classNames = [
    'recommendation',
    'recommendation_place_page',
    'fade-in',
    sectionClass,
  ]
    .join(' ')
    .trim();

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
